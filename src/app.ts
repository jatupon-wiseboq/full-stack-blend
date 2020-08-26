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
import errorHandler from "errorhandler";
import dotenv from "dotenv";

const MongoStore = mongo(session);

if (["development", "staging", "production"].indexOf(process.env.NODE_ENV) == -1) {
  dotenv.config();
}

// Create Express server
const app = express();

if (["staging", "production"].indexOf(process.env.NODE_ENV) == -1) {
	app.use(secure);
	app.enable("trust proxy");
} else {
	// app.use(secure);
	// app.enable("trust proxy");
}

// Express configuration
//
if (["staging", "production"].indexOf(process.env.NODE_ENV) == -1) {
  app.set("trust proxy", 1);
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        url: process.env[process.env.DOCUMENT_DATABASE_KEY],
        autoReconnect: true,
        mongoOptions: {
        	useUnifiedTopology: true
        }
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
				autoReconnect: true,
        mongoOptions: {
        	useUnifiedTopology: true
        }
    }),
    cookie: {}
  }));
}

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));

if (["staging", "production"].indexOf(process.env.NODE_ENV) == -1) {
	// app.use(lusca.xframe("SAMEORIGIN"));
} else {
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
} else {
	// app.use(cors());
}

// Cache configuration
// 
app.use(
    express.static(path.join(__dirname, "public"), { maxAge: 0 })
);

// Error handler
if (["production"].indexOf(process.env.NODE_ENV) == -1) {
  app.use(errorHandler());
}

// StackBlend code editor's endpoint
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

export default app;