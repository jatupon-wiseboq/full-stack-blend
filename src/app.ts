import express from "express";
import secure from "express-force-https";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import mongo from "connect-mongo";
import path from "path";
import cors from "cors";
import errorHandler from "errorhandler";
import dotenv from "dotenv";
import polyfill from "polyfill-library";
import {SitemapHelper} from './controllers/helpers/SitemapHelper';

const MongoStore = mongo(session);

if (["development", "staging", "production"].indexOf(process.env.NODE_ENV) == -1) {
  dotenv.config();
}

// Create Express server
const app = express();

if (["development", "staging", "production"].indexOf(process.env.NODE_ENV) == -1) {
  app.use(secure);
  app.enable("trust proxy");
} else {
  // app.use(secure);
  // app.enable("trust proxy");
}

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
    cookie: {secure: true}
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

if (["development", "staging", "production"].indexOf(process.env.NODE_ENV) == -1) {
  // app.use(lusca.xframe("SAMEORIGIN"));
} else {
  app.use(lusca.xframe("SAMEORIGIN"));
}

app.use(lusca.xssProtection(true));

// CORS configuration
// 
if (["development", "staging", "production"].indexOf(process.env.NODE_ENV) == -1) {
  app.use(cors());
} else {
  // app.use(cors());
}

// Cache configuration
// 
app.use(
  express.static(path.join(__dirname, "public"), {maxAge: 0})
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
      'es5': {flags: ['gated']},
      'es6': {flags: ['gated']},
      'es7': {flags: ['gated']}
    }
  }).then(function(bundle) {
    res.set('Content-Type', 'text/javascript');
    res.send(Buffer.from(bundle));
  });
});

// Serve sitemap.xml
app.get("/sitemap.xml", (req, res) => {
  res.set('Content-Type', 'text/xml');
  res.send(SitemapHelper.generateXMLDocument());
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