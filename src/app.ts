import express from "express";
import secure from "express-force-https";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import mongo from "connect-mongo";
import flash from "express-flash";
import path from "path";
import passport from "passport";
import bluebird from "bluebird";
import cors from "cors";
import fs from "fs";
import * as SocketIO from "socket.io";
import dotenv from "dotenv";

const MongoStore = mongo(session);

if (["staging", "production"].indexOf(process.env.NODE_ENV) == -1) {
  dotenv.config();
}

// Create Express server
const app = express();
let socket = null;

if (["development", "staging", "production"].indexOf(process.env.NODE_ENV) == -1) {
  const https = require("https");
  
  // SSL
  const sslkey = fs.readFileSync("localhost.key");
  const sslcert = fs.readFileSync("localhost.crt");
  const options = {
      key: sslkey,
      cert: sslcert
  };
  
  const server = https.createServer(options, app).listen(443);
	
	socket = SocketIO.listen(server);
} else {
	const http = require("http");
	
  const server = http.createServer(app).listen(process.env.PORT || 8000);
	
	socket = SocketIO.listen(server);
}

if (["staging", "production"].indexOf(process.env.NODE_ENV) != -1) {
	// Use Flexible SSL on Cloudflare instead.
	//
	// app.use(secure);
	// app.enable("trust proxy");
}

// Express configuration
//
if (["staging", "production"].indexOf(process.env.NODE_ENV) != -1) {
  app.set("trust proxy", 1);
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        url: process.env[process.env.DOCUMENT_DATABASE_KEY],
        autoReconnect: true
    }),
    cookie: { secure: true }
  }));
} else {
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
				url: process.env[process.env.DOCUMENT_DATABASE_KEY],
				autoReconnect: true
    }),
    cookie: {}
  }));
}

app.set("port", process.env.PORT || 8000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));

if (["staging", "production"].indexOf(process.env.NODE_ENV) != -1) {
	app.use(lusca.xframe("SAMEORIGIN"));
}

app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// CORS configuration
// 
if (["staging", "production"].indexOf(process.env.NODE_ENV) == -1) {
	app.use(cors());
}

// Cache configuration
// 
app.use(
    express.static(path.join(__dirname, "public"), { maxAge: 0 })
);

// For Endpoint Testing of StackBlend Editor
// 
import * as endpoint from "./controllers/Endpoint";

if (["staging", "production"].indexOf(process.env.NODE_ENV) == -1) {
	endpoint.clearRecentError();
	app.post("/endpoint/update/content", endpoint.updateContent);
	app.get("/endpoint/recent/error", endpoint.getRecentError);
	
	app.use((err, req, res, next) => {
    endpoint.addRecentError(err);
    next();
  });
  process.on("uncaughtException", (err) => {
  	endpoint.addRecentError(err);
	});
}

// For StackBlend Routings & Controllers
// 
try {
	const route = require("./route");
	route.default(app);
} catch (error) {
	console.log("\x1b[31m", error, "\x1b[0m");
	endpoint.addRecentError(error);
}

export {app, socket};