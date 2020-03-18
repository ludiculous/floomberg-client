const MongoClient = require("mongodb").MongoClient;
const dbUrl = "mongodb://localhost:27017";
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const authRouter = (router, client) => {
  router.get("/auth/getUser", (req, res) => {
    var db;
    process.env.MONGODB_DB
      ? (db = client.db(process.env.MONGODB_DB))
      : (db = client.db("Floomberg"));
    const username = req.query.username;
    console.log(username);
    db.collection("Users")
      .find({
        username: username
      })
      .toArray((err, docs) => {
        if (err) {
          throw new Error(err);
        }
        console.log(docs);
        res.send({
          user: docs
        });
      });
  });

  router.post("/auth/login", passport.authenticate("jwt-auth"), (req, res) => {
    var db;
    process.env.MONGODB_DB
      ? (db = client.db(process.env.MONGODB_DB))
      : (db = client.db("Floomberg"));
    const token = jwt.sign(req.user, "your_jwt_secret");
    console.log("login route", req.user);
    console.log("token", token);
    const { username, usertype, id } = req.user;

    res.send({
      id,
      token,
      username,
      usertype
    });
  });

  router.post(
    "/auth/login/cred",
    passport.authenticate("basic-signin"),
    (req, res) => {
      var db;
      process.env.MONGODB_DB
        ? (db = client.db(process.env.MONGODB_DB))
        : (db = client.db("Floomberg"));

      console.log("req user", req.user);
      const token = jwt.sign(req.user, "your_jwt_secret");
      const { username, usertype, id } = req.user;

      res.send({
        id,
        token,
        username,
        usertype
      });
    }
  );

  router.post("/auth/createUser", (req, res) => {
    var db;
    process.env.MONGODB_DB
      ? (db = client.db(process.env.MONGODB_DB))
      : (db = client.db("Floomberg"));
    console.log("inside auth createUser route");
    var hash = bcrypt.hashSync(req.body.password, 8);
    const { username, password, usertype } = req.body;

    let userObj = {
      username: username,
      password: password,
      usertype: usertype
    };

    userObj.password = hash;
    console.log(userObj);

    if (userObj.username.length) {
      db.collection("Users").insertOne(userObj, (err, result) => {
        //console.log(result)
        //console.log(token)
        //res.send({user: token});
        res.send({ message: `created ${result}` });
      });
    }
  });

  router.get("/auth/logout", (req, res) => {
    // var name = req.username;
    // console.log("LOGGIN OUT " + req.username)
    req.logout();
    //res.redirect('/');
    res.send({ message: "Logged Out" });
    req.session.notice = "You have successfully been logged out";
  });

  return router;
};

module.exports = authRouter;
