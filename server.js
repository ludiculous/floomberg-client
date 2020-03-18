const express = require("express");
const app = express();
const assert = require("assert");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const etfRoutes = require("./src/server/etfRoutes");
const futureRoutes = require("./src/server/futureRoutes");
const intEtfRoutes = require("./src/server/intEtfRoutes");
const fileRoutes = require("./src/server/fileRoutes");
const authRoutes = require("./src/server/authRoutes");
const validateEntries = require("./src/server/fileRoutes/validateEntry");
const cookieParser = require("cookie-parser");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const passport = require("passport");
var dbUrl = process.env.MONGODB_URI || "mongodb://localhost/127001";
const path = require("path");
const mongoOptions = {
  useNewUrlParser: true
};

let defPath = "/dist/index.html";
const host = "0.0.0.0";
const port = process.env.PORT || 8080;
MongoClient.connect(dbUrl, mongoOptions, function(err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(dbUrl);
  app.use(express.static("dist"));
  app.use(
    session({
      secret: "supernova",
      saveUninitialized: true,
      resave: true,
      store: new MongoStore({
        url: dbUrl,
        collection: "floombergSessions"
      })
    })
  );
  require("./src/server/passportConfig")(client);
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

  app.use((req, res, next) => {
    var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

    delete req.session.error;
    delete req.session.success;
    delete req.session.notice;

    if (err) res.locals.error = err;
    if (msg) res.locals.notice = msg;
    if (success) res.locals.success = success;

    next();
  });
  app.use("/api", etfRoutes(router, client));
  app.use("/api", futureRoutes(router, client));
  app.use("/api", intEtfRoutes(router, client));
  app.use("/api", fileRoutes(router, client));
  app.use("/api", authRoutes(router, client));

  app.get("/loaddata", (req, res) => {
    res.send({
      message: "running"
    });
  });

  app.use(express.static(defPath));
  app.listen(port, host, () =>
    console.log(`Listening on port ${port}! ${defPath}`)
  );
});
