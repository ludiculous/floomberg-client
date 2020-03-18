const passport = require('passport');
const bcrypt = require('bcrypt');
const Q = require('q');
const BasicStrategy = require('passport-http').BasicStrategy;
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const jwtAuth = (client, jwtPayload) => {
  var db;
  process.env.MONGODB_DB ? db = client.db(process.env.MONGODB_DB) : db = client.db('Floomberg');
  var deferred = Q.defer();
  var collection = db.collection('Users');
  console.log("jwt", jwtPayload)
  collection.findOne({id: jwtPayload.sub})
    .then(function (result) {
      if (null == result) {
        console.log("USERNAME NOT FOUND:");
        deferred.resolve(Error("USERNAME NOT FOUND"));
      }
      else {
        deferred.resolve(result);
      }
    });
  return deferred.promise
}

const basicAuth = (client, username, password) =>{
  var db;
  process.env.MONGODB_DB ? db = client.db(process.env.MONGODB_DB) : db = client.db('Floomberg');
  var deferred = Q.defer();
  var collection = db.collection('Users');
  collection.findOne({'username' : username})
    .then(function (result) {
      if (null == result) {
        console.log("USERNAME NOT FOUND:", username);
        deferred.resolve(new Error("USERNAME NOT FOUND"));
      }
      else {
        var hashMatch = null;
        console.log(result)

        console.log("FOUND USER: " + result.username);
        bcrypt.compare(password, result.password, function(err, matchResults){
          if (matchResults) {
            console.log("hm", matchResults)
            deferred.resolve(result);
          } else {
            console.log("AUTHENTICATION FAILED");
            deferred.resolve(new Error("AUTHENTICATION FAILED"));
          }
        });
        //console.log("hash: ", hash);
        // bcrypt.compareSync(password, hash)
        // used for basic auth
      }
    });
  return deferred.promise
}

const basicReg = (client, username, password) => {
  var db;
  process.env.MONGODB_DB ? db = client.db(process.env.MONGODB_DB) : db = client.db('Floomberg');
  var deferred = Q.defer();
  var collection = db.collection('Users');

  collection.findOne({'username' : username})
      .then(function (result) {
        if (null != result) {
          console.log("USERNAME ALREADY EXISTS", result.username);
          deferred.resolve(new Error("USERNAME ALREADY EXISTS")); // username exists
        }
        else  {
          var hash = bcrypt.hashSync(password, 8);
          var user = {
            "username": username,
            "password": hash
          }

          console.log("CREATING USER:", username);
          collection.insertOne(user)
            .then(function () {
              deferred.resolve(user);
            });
        }
  });
  return deferred.promise;
}

const passportConfig = (client) => {

  passport.use('basic-signin', new BasicStrategy(
    {passReqToCallback : true}, //allows us to pass back the request to the callback
    function(req, username, password, done) {
      console.log("inside basic signin")
      //console.log(req)
      basicAuth(client, username, password)
        .then(function (user) {
          if (user) {
            console.log("LOGGED IN AS: " + user.username);
            req.session.success = 'You are successfully logged in ' + user.username + '!';
            done(null, user);
          }
          if (!user) {
            console.log("COULD NOT LOG IN");
            req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
            done(null, user);
          }
        })
        .fail(function (err){
          //console.log(err.body);
        });
    }
  ));

  passport.use('basic-signup', new BasicStrategy(
    {passReqToCallback : true}, //allows us to pass back the request to the callback
    function(req, username, password, done) {
      console.log(username, password,)

      basicReg(client, username, password)
        .then(function (user) {
          if (user) {
            console.log("REGISTERED: " + user.username);
            req.session.success = 'You are successfully registered and logged in ' + user.username + '!';
            done(null, user);
          }
          if (!user) {
            console.log("COULD NOT REGISTER");
            req.session.error = 'That username is already in use, please try a different one.'; //inform user could not log them in
            done(null, user);
          }
        })
        .fail(function (err){
          console.log(err.body);
        });
    }
  ));

  passport.use('jwt-auth', new JWTStrategy({
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey   : 'your_jwt_secret',
      passReqToCallback : true
    },
    function (req, jwtPayload, done) {
      jwtAuth(client, jwtPayload)
        .then(function (user) {
          if (user) {
            console.log("logged in as: " + user.username);
            req.session.success = 'You are successfully logged in ' + user.username + '!';
            done(null, user);
          }
          if (!user) {
            console.log("COULD NOT LOGIN");
            req.session.error = 'That username is already in use, please try a different one.'; //inform user could not log them in
            done(null, user);
          }
      })
      .fail(function (err){
        console.log(err.body);
      });
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  return passport;
}

module.exports = passportConfig;
