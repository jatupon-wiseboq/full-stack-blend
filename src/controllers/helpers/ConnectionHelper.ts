// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import url from "url";
import redis from "redis";
import mysql from "mysql2";
import {MongoClient} from "mongodb";
import sidekiq from "sidekiq";
import {Sequelize, Transaction} from "sequelize";
import dotenv from "dotenv";

let VolatileMemoryClient = null;
let RelationalDatabaseClient = null;
let RelationalDatabaseORMClient = null;
let DocumentDatabaseClient = null;
let PrioritizedWorkerVolatileMemoryClient = null;
let PrioritizedWorkerClient = null;

if (["staging", "production"].indexOf(process.env.NODE_ENV) == -1) {
  dotenv.config();
}

if (process.env.VOLATILE_MEMORY_KEY) {
	const connectionURL = new URL(process.env[process.env.VOLATILE_MEMORY_KEY]);
	const _default = redis.createClient({
		host     : connectionURL.host.split(':')[0],
	  user     : connectionURL.username,
	  password : connectionURL.password,
	  port     : connectionURL.port
	});
	
	VolatileMemoryClient = {
		default: _default,
		get: (key: any): Promise<any> => {
			return new Promise(async (resolve, reject) => {
				_default.get(key, (error, reply) => {
					if (error) reject(error);
					else resolve(reply);
				});
			});
		},
		set: (key: any, value: any): Promise<any> => {
			return new Promise(async (resolve, reject) => {
				_default.set(key, value, (error, reply) => {
					if (error) reject(error);
					else resolve(reply);
				});
			});
		},
		del: (key: any): Promise<any> => {
			return new Promise(async (resolve, reject) => {
				_default.del(key, (error, reply) => {
					if (error) reject(error);
					else resolve(reply);
				});
			});
		}
	};
}
if (process.env.RELATIONAL_DATABASE_KEY) {
	const connectionURL = new URL(process.env[process.env.RELATIONAL_DATABASE_KEY]);
	const dbconfig = {
	  connectionLimit : 10,
	  host     : connectionURL.host.split(':')[0],
	  user     : connectionURL.username,
	  password : connectionURL.password,
	  database : connectionURL.pathname.split("/")[1]
	};
	RelationalDatabaseClient = mysql.createPool(dbconfig);
	RelationalDatabaseORMClient = new Sequelize(connectionURL.pathname.split("/")[1],
	  connectionURL.username,
	  connectionURL.password, {
      host: connectionURL.host,
      dialect: "mysql"
    }
  );
}
if (process.env.DOCUMENT_DATABASE_KEY) {
	const connectionURL = process.env[process.env.DOCUMENT_DATABASE_KEY];
	DocumentDatabaseClient = new MongoClient(connectionURL, {
		useUnifiedTopology: true
	});
}
if (process.env.PRIORITIZED_WORKER_KEY) {
	if (process.env.PRIORITIZED_WORKER_KEY == process.env.VOLATILE_MEMORY_KEY) {
		PrioritizedWorkerVolatileMemoryClient = VolatileMemoryClient.default;
	} else {
		const connectionURL = new URL(process.env[process.env.PRIORITIZED_WORKER_KEY]);
		PrioritizedWorkerVolatileMemoryClient = redis.createClient({
			host     : connectionURL.host.split(':')[0],
		  user     : connectionURL.username,
		  password : connectionURL.password,
		  port     : connectionURL.port
		});
	}
	PrioritizedWorkerClient = new sidekiq(PrioritizedWorkerVolatileMemoryClient, process.env.NODE_ENV);
}

const CreateTransaction = async (options) => {
	let relationalDatabaseTransaction = null;
	let documentDatabaseConnection = null;
	let documentDatabaseSession = null;
	
	if (RelationalDatabaseORMClient) {
		relationalDatabaseTransaction = await RelationalDatabaseORMClient.transaction();
	}
	if (DocumentDatabaseClient) {
		documentDatabaseConnection = await DocumentDatabaseClient.connect();
		try {
			documentDatabaseSession = DocumentDatabaseClient.startSession({
				retryWrites: true,
				causalConsistency: true
			});
			documentDatabaseSession.startTransaction({
				readPreference: 'primary',
				readConcern: {
					level: 'local'
				},
				writeConcern: {
					w: 'majority'
				}
	    });
	 	} catch {
	 		documentDatabaseSession = null;
	 	}
	}
	
	return {
		commit: async () => {
			try {
				if (relationalDatabaseTransaction) await relationalDatabaseTransaction.commit();
				if (documentDatabaseSession) documentDatabaseSession.commitTransaction();
			} finally {
				if (documentDatabaseSession) documentDatabaseSession.endSession();
			}
		},
		rollback: async () => {
			try {
				if (relationalDatabaseTransaction) await relationalDatabaseTransaction.rollback();
				if (documentDatabaseSession) documentDatabaseSession.abortTransaction();
			} finally {
				if (documentDatabaseSession) documentDatabaseSession.endSession();
			}
		},
		relationalDatabaseTransaction: relationalDatabaseTransaction,
		documentDatabaseConnection: documentDatabaseConnection,
		documentDatabaseSession: documentDatabaseSession
	};
};

let terminate = () => {
	if (VolatileMemoryClient) VolatileMemoryClient.quit();
	if (RelationalDatabaseClient) RelationalDatabaseClient.end();
	if (RelationalDatabaseORMClient) RelationalDatabaseORMClient.close();
	if (DocumentDatabaseClient) DocumentDatabaseClient.close();
	if (PrioritizedWorkerVolatileMemoryClient) PrioritizedWorkerVolatileMemoryClient.quit();
	if (PrioritizedWorkerClient) void(0);
};

process.on('SIGINT', terminate);
process.on('SIGTERM', terminate);

export {VolatileMemoryClient, RelationalDatabaseClient, RelationalDatabaseORMClient, DocumentDatabaseClient, PrioritizedWorkerVolatileMemoryClient, PrioritizedWorkerClient, CreateTransaction};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.
