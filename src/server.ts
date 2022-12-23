import * as SocketIO from "socket.io";
import fs from "fs";
import dotenv from "dotenv";
import { createClient } from "ioredis";
import * as child from "child_process";
import { base64id } from "base64id";
import { NotificationHelper } from './controllers/helpers/NotificationHelper';

import app from "./app";

console.log("Initializing server and socket..");

let socket = null;
let server = null;

if (["development", "staging", "production", "worker"].indexOf(process.env.NODE_ENV) == -1) {
  dotenv.config();
}

if (["development", "staging", "production", "worker"].indexOf(process.env.NODE_ENV) == -1) {
	child.execSync('kill-port 443');
	
  const https = require("https");
  
  // Development SSL
  const sslkey = fs.readFileSync("localhost.key");
  const sslcert = fs.readFileSync("localhost.crt");
  const options = {
      key: sslkey,
      cert: sslcert
  };
  
  server = https.createServer(options, app).listen(443);
	socket = SocketIO.listen(server);
} else if (["worker"].indexOf(process.env.NODE_ENV) == -1) {
	child.execSync('kill-port ' + (process.env.PORT || 8000));
	
	const http = require("http");
	
	// [TODO] Replace and configure production SSL
  server = http.createServer(app).listen(process.env.PORT || 8000);
	socket = SocketIO.listen(server);
}

NotificationHelper.setup(socket);
NotificationHelper.listenUpdatesUsingMultipleNodesOfSocketIO();

// Resque
//
const {Worker, Scheduler, Queue, Plugins} = require("node-resque");

let queue: any = null;
let scheduler: any = null;
let finalize: () => void = null;
const complete = {};

if (process.env.PRIORITIZED_WORKER_KEY) {
	const redisConnectionURL = process.env[process.env.PRIORITIZED_WORKER_KEY];
	const redisClientForResque = createClient(redisConnectionURL);
	const redisConnectionSettingForResque = {
		redis: redisClientForResque
	};
	const jobs = {
	  perform: {
	    plugins: [Plugins.JobLock],
	    pluginOptions: {
	      JobLock: {reEnqueue: true},
	    },
	    perform: async (table: any) => {
	    	const {WorkerHelper} = require("./controllers/helpers/WorkerHelper");
	      await WorkerHelper.perform(table);
	    }
	  }
	};
	
	const shouldEnableBackgroundJobs = (["development", "staging", "production", "worker"].indexOf(process.env.NODE_ENV) == -1 ||
		["worker"].indexOf(process.env.NODE_ENV) != -1);
	
	queue = new Queue({
			connection: redisConnectionSettingForResque
		},
		jobs
	);
	scheduler = new Scheduler({
			connection: redisConnectionSettingForResque
		}
	);
	
	if (shouldEnableBackgroundJobs) {
		for (let i=0; i<(process.env.PRIORITIZED_WORKER_THREAD || 5); i++) {
			const worker = new Worker(
			  {
			  	connection: redisConnectionSettingForResque,
			  	queues: ["general", ...((["worker"].indexOf(process.env.NODE_ENV) == -1) ? (process.env.PRIORITIZED_WORKER_INSIDE_WEB_QUEUES || "serverA,serverB,serverC").split(",") : (process.env.PRIORITIZED_WORKER_QUEUES || "workerA,workerB,workerC").split(","))]
			  },
			  shouldEnableBackgroundJobs ? jobs : {}
			);
			
			console.log(`Booting worker #${i}..`);
			worker.on("error", (error) => {
			  console.log(error);
			});
			worker.connect().then(() => {
				console.log(`Started worker #${i}.`);
				worker.start();
				
				complete['worker'] = true;
				complete['worker'] && complete['scheduler'] && complete['queue'] && finalize && finalize();
			});
		}
	} else {
		complete['worker'] = true;
	}
	
	if (["worker"].indexOf(process.env.NODE_ENV) == -1) {
		console.log("Booting scheduler..");
		scheduler.on("error", (error) => {
		  console.log(error);
		});
		scheduler.connect().then(() => {
			console.log("Started scheduler.");
			scheduler.start();
			
			complete['scheduler'] = true;
			complete['worker'] && complete['scheduler'] && complete['queue'] && finalize && finalize();
		});
	} else {
		complete['scheduler'] = true;
	}
	
	console.log("Booting queue..");
	queue.on("error", (error) => {
	  console.log(error);
	});
	queue.connect().then(() => {
		console.log("Started queue.");
		
		complete['queue'] = true;
		complete['worker'] && complete['scheduler'] && complete['queue'] && finalize && finalize();
	});
	
	complete['worker'] && complete['scheduler'] && complete['queue'] && finalize && finalize();
} else {
	complete['worker'] = true;
	complete['scheduler'] = true;
	complete['queue'] = true;
}

// StackBlend routes
// 
finalize = () => {
	finalize = null;
	
	console.log("Registering jobs..");
	try {
		require("./controllers/Home");
	} catch(error) {
		console.log(error);
	}
	console.log("Registered.");
	console.log("Initialized server and socket.");
		
	if (["worker"].indexOf(process.env.NODE_ENV) == -1) {		
		console.log("Initializing StackBlend router..");
		
		let endpoint = null;
		try {
			endpoint = require("./controllers/Endpoint");
			const route = require("./route");
			route.default(app);
		} catch (error) {
			if (process.env.JEST_WORKER_ID !== undefined) {
				console.log("\x1b[33m", error, "\x1b[0m");
			} else {
				console.log("\x1b[31m", error, "\x1b[0m");
			}
			endpoint && endpoint.addRecentError(error);
		}
		
		// StackBlend test console
		// 
		if (["production"].indexOf(process.env.NODE_ENV) == -1) {
			const controller = require("./controllers/components/Test");
		
			app.get("/test/api", controller.index);
			app.post("/test/api", controller.index);
			app.put("/test/api", controller.index);
			app.delete("/test/api", controller.index);
		}
		
		console.log("Initialized StackBlend router.");
	}
};
complete['worker'] && complete['scheduler'] && complete['queue'] && finalize && finalize();

export {server, queue, scheduler};
