import express from "express";
import secure from "express-force-https";
import compression from "compression"; // Compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import mongo from "connect-mongo";
import flash from "express-flash";
import path from "path";
import mongoose from "mongoose";
import bluebird from "bluebird";
import cors from "cors";
import fs from "fs";
import errorHandler from "errorhandler";
import dotenv from "dotenv";
import polyfill from "polyfill-library";

// API keys and Passport configuration
import passport from "passport";
import * as passportConfig from "./config/passport";

const MongoStore = mongo(session);

// Controllers (route handlers)
import * as constructionController from "./controllers/construction";
import * as userController from "./controllers/user";
import * as apiController from "./controllers/api";
import * as contactController from "./controllers/contact";

if (["development", "staging", "production"].indexOf(process.env.NODE_ENV) == -1) {
  dotenv.config();
} else {
	dotenv.config();
}

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = process.env[process.env.DOCUMENT_DATABASE_KEY];
mongoose.Promise = bluebird;
mongoose.connect(mongoUrl, {useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true}).then(() => { /** Ready to use. The `mongoose.connect()` promise resolves to undefined. */ }).
    catch((err) => {

        console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
        // Process.exit();

    });

app.use(secure);
app.enable("trust proxy");

// Express configuration
//
if (["development", "staging", "production"].indexOf(process.env.NODE_ENV) == -1) {
  app.set("trust proxy", 1);
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: process.env.DOCUMENT_DATABASE_KEY && new MongoStore({
        url: process.env[process.env.DOCUMENT_DATABASE_KEY],
        autoReconnect: true,
        mongoOptions: {
        	useUnifiedTopology: true
        }
    }) || null,
    cookie: { secure: true }
  }));
} else {
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: process.env.DOCUMENT_DATABASE_KEY && new MongoStore({
				url: process.env[process.env.DOCUMENT_DATABASE_KEY],
				autoReconnect: true,
        mongoOptions: {
        	useUnifiedTopology: true
        }
    }) || null,
    cookie: {}
  }));
}

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

if (["development", "staging", "production"].indexOf(process.env.NODE_ENV) == -1) {
	app.use(lusca.xframe("SAMEORIGIN"));
}

app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    if (!req.user &&
    req.path !== "/login" &&
    req.path !== "/signup" &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)) {
        req.session.returnTo = req.path;
    
    } else if (req.user &&
    req.path == "/account/settings") {
        req.session.returnTo = req.path;
    }
    next();
});

// CORS configuration
// 
if (["development", "staging", "production"].indexOf(process.env.NODE_ENV) == -1) {
	app.use(cors());
} else {
	// app.use(cors());
}

/**
 * Primary app routes.
 */
app.get("/editor", constructionController.index);
app.get("/editor/construction/area/html", constructionController.html);
app.get("/logout", userController.logout);
app.get("/account/delete", passportConfig.isAuthenticated, userController.getDeleteAccount);
app.get("/account/unlink/:provider", passportConfig.isAuthenticated, userController.getOauthUnlink);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get("/auth/facebook", passport.authenticate("facebook", {scope: ["email",
    "public_profile"]}));
app.get("/auth/facebook/callback", passport.authenticate("facebook", {failureRedirect: "/account/authenticate"}), (req, res) => {
    res.redirect("/account/settings");
});
app.get("/auth/github", passport.authenticate("github", {scope: ["repo"]}));
app.get("/auth/github/callback", passport.authenticate("github", {failureRedirect: "/account/authenticate"}), (req, res) => {
    res.redirect("/account/settings");
});

// Cache configuration
// 
app.use(
    express.static(path.join(__dirname, "public"), { maxAge: 0 })
);

// Error handler
if (["production"].indexOf(process.env.NODE_ENV) == -1) {
  app.use(errorHandler());
}

// Serve polyfill.io under the same domain to ease non-SNI configuration.
// 
app.get('/js/libraries/polyfills/polyfill.io.js', (req, res) => {
  polyfill.getPolyfillString({
    uaString: req.get('User-Agent'),
    minify: true,
    features: {
      'es5': { flags: ['gated'] },
      'es6': { flags: ['gated'] },
      'es7': { flags: ['gated'] }
    }
  }).then(function(bundle) {
    res.set('Content-Type', 'text/javascript');
  	res.send(Buffer.from(bundle));
  });
});

// StackBlend code editor's endpoint
// 
import * as endpoint from "./controllers/Endpoint";

if (["development", "staging", "production"].indexOf(process.env.NODE_ENV) == -1) {
	endpoint.clearRecentError();
	app.post("/endpoint/update/content", endpoint.updateContent);
	app.post("/endpoint/reset/content", endpoint.resetContent);
	app.post("/endpoint/pull/content", endpoint.pullContent);
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