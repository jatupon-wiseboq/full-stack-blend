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
import passport from "passport";
import bluebird from "bluebird";
import cors from "cors";
import fs from "fs";
import {MONGODB_URI, SESSION_SECRET} from "./util/secrets";

const MongoStore = mongo(session);

// Controllers (route handlers)
import * as constructionController from "./controllers/construction";
import * as userController from "./controllers/user";
import * as apiController from "./controllers/api";
import * as contactController from "./controllers/contact";

// API keys and Passport configuration
import * as passportConfig from "./config/passport";

// Create Express server
const app = express();

if (["development", "staging", "production"].indexOf(process.env.NODE_ENV) == -1) {
  const https = require("https");
  
  // SSL
  const sslkey = fs.readFileSync("localhost.key");
  const sslcert = fs.readFileSync("localhost.crt");
  const options = {
      key: sslkey,
      cert: sslcert
  };
  
  https.createServer(options, app).listen(443);
}

// Connect to MongoDB
const mongoUrl = MONGODB_URI;

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
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
        url: mongoUrl,
        autoReconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
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
    req.path == "/account") {

        req.session.returnTo = req.path;

    }
    next();
});

app.use(express.static(path.join(__dirname, "public"), {maxAge: 0}));

/**
 * CORS configuration
 */
if (["production"].indexOf(process.env.NODE_ENV) == -1) {
	app.use(cors());
}

/**
 * Primary app routes.
 */
app.get("/editor", constructionController.index);
app.get("/editor/construction/area/html", constructionController.html);
app.get("/login", userController.getLogin);
app.post("/login", userController.postLogin);
app.get("/logout", userController.logout);
app.get("/forgot", userController.getForgot);
app.post("/forgot", userController.postForgot);
app.get("/reset/:token", userController.getReset);
app.post("/reset/:token", userController.postReset);
app.get("/signup", userController.getSignup);
app.post("/signup", userController.postSignup);
app.get("/contact", contactController.getContact);
app.post("/contact", contactController.postContact);
app.get("/account", passportConfig.isAuthenticated, userController.getAccount);
app.post("/account/profile", passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post("/account/github", passportConfig.isAuthenticated, userController.postUpdateGitHub);
app.post("/account/password", passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post("/account/delete", passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get("/account/unlink/:provider", passportConfig.isAuthenticated, userController.getOauthUnlink);

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

/**
 * API examples routes.
 */
app.get("/api", apiController.getApi);
app.get("/api/facebook", passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get("/auth/facebook", passport.authenticate("facebook", {scope: ["email",
    "public_profile"]}));
app.get("/auth/facebook/callback", passport.authenticate("facebook", {failureRedirect: "/login"}), (req, res) => {

    res.redirect("/editor");

});
app.get("/auth/github", passport.authenticate("github", {scope: ["repo"]}));
app.get("/auth/github/callback", passport.authenticate("github", {failureRedirect: "/login"}), (req, res) => {

    res.redirect("/account");

});

export default app;
