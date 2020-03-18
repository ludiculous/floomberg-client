const MongoClient = require("mongodb").MongoClient;
const dbUrl = "mongodb://localhost:27017";
const passport = require("passport");
const getFullDate = date => {
  return date
    ? date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
    : "";
};
const etfFlowRouter = (router, client) => {
  router.get(
    "/getEtfFlow/tickerList",
    passport.authenticate("jwt-auth"),
    (req, res) => {
      var db;
      process.env.MONGODB_DB
        ? (db = client.db(process.env.MONGODB_DB))
        : (db = client.db("Floomberg"));

      const { usertype } = req.user;
      console.log("usertype", usertype);
      db.collection("EtfFlow").distinct("t", (err, docs) => {
        if (err) {
          console.log(err);
        }
        res.send(docs.sort());
      });
    }
  );

  router.get(
    "/getEtfFlow/assetList",
    passport.authenticate("jwt-auth"),
    (req, res) => {
      var db;
      process.env.MONGODB_DB
        ? (db = client.db(process.env.MONGODB_DB))
        : (db = client.db("Floomberg"));

      db.collection("EtfFlow").distinct("aC", (err, docs) => {
        if (err) {
          console.log(err);
        }
        res.send(docs.sort());
      });
    }
  );

  router.get(
    "/getEtfFlow/msCatList",
    passport.authenticate("jwt-auth"),
    (req, res) => {
      var db;
      process.env.MONGODB_DB
        ? (db = client.db(process.env.MONGODB_DB))
        : (db = client.db("Floomberg"));

      db.collection("EtfFlow").distinct("msC", (err, docs) => {
        if (err) {
          console.log(err);
        }
        res.send(docs.sort());
      });
    }
  );

  router.get(
    "/getEtfFlow/ticker",
    passport.authenticate("jwt-auth"),
    (req, res) => {
      var db;
      process.env.MONGODB_DB
        ? (db = client.db(process.env.MONGODB_DB))
        : (db = client.db("Floomberg"));
      // create a query for every ticker symbol in qs
      let documents = [];

      req.query.symbols.forEach(ticker => {
        let dateQueryObj = Object.assign(
          {},
          req.query.from_date ? { $gte: new Date(req.query.from_date) } : null,
          req.query.to_date ? { $lte: new Date(req.query.to_date) } : null
        );

        let queryObj = Object.assign(
          {},
          { date: { $exists: true } },
          req.query.from_date || req.query.to_date
            ? { date: dateQueryObj }
            : null,
          ticker ? { t: ticker } : null
        );

        console.log(queryObj);
        db.collection("EtfFlow")
          .find(queryObj)
          .sort({ date: -1 })
          .toArray(function(err, docs) {
            if (err) {
              console.log(err);
            }

            documents.push({
              category: ticker,
              docs: docs
            });
            if (documents.length === req.query.symbols.length) {
              console.log("reached length: ", req.query.symbols.length);
              res.send(documents);
            }
          });
      });
    }
  );

  const getCat = (catType, Cat, db, docList, req, res) => {
    let catQuery;
    if (catType === "msCats") {
      catQuery = { msC: Cat };
    }

    if (catType === "assetCats") {
      console.log(Cat);
      catQuery = { $and: [{ aC: Cat }, { short: { $ne: "-1" } }] };
    }

    db.collection("EtfFlow")
      .find(catQuery)
      .toArray((err, docs) => {
        let tickers = docs.map(doc => doc.t);
        let andQuery = [];

        let dateQueryObj = {};
        if (req.query.from_date) {
          dateQueryObj["$gte"] = new Date(req.query.from_date);
        }
        if (req.query.to_date) {
          dateQueryObj["$lte"] = new Date(req.query.to_date);
        }
        if (dateQueryObj && Object.keys(dateQueryObj).length) {
          andQuery.push({ date: dateQueryObj });
        }
        if (Cat && Cat.length) {
          andQuery.push({ t: { $in: tickers } });
        }
        console.log(andQuery);
        // tickers are already grouped to a specific category
        db.collection("EtfFlow")
          .aggregate([
            {
              $match: {
                $and: andQuery
              }
            },
            {
              $group: {
                _id: {
                  etfId: "$_id.date"
                },
                date: { $first: "$date" },
                t: { $first: "$t" },
                flowSum: { $sum: "$flow" },
                tnaSum: { $sum: "$tna" },
                nav_prcntAvg: { $avg: "$nav_prcnt" }
                //need conditional to check if $tna is at least 0
                //flow_tna_ratio: {$sum:{$divide: ["$flow", "$tna"]}}
              }
            },
            {
              $project: {
                t: "$t",
                date: "$date",
                flowSum: "$flowSum",
                tnaSum: "$tnaSum",
                nav_prcntAvg: "$nav_prcntAvg",
                flow_tna_ratio: {
                  $cond: [
                    { $eq: ["$tnaSum", 0] },
                    0,
                    { $divide: ["$flowSum", "$tnaSum"] }
                  ]
                }
              }
            }
          ])
          .sort({ date: -1 })
          .toArray((err, docsCat) => {
            if (err) {
              console.log(err);
            }
            docList.push({
              category: Cat,
              docs: docsCat
            });
            if (docList.length == req.query[catType].length) {
              console.log("reached length");
              res.send(docList);
            }
          });
      });
  };

  router.get(
    "/getEtfFlow/msCategory",
    passport.authenticate("jwt-auth", { failureRedirect: "/#/login" }),
    (req, res) => {
      var db;
      process.env.MONGODB_DB
        ? (db = client.db(process.env.MongoClient))
        : (db = client.db("Floomberg"));
      // store the array returned by the map function
      let docList = [];
      req.query.msCats.map(msCat => {
        getCat("msCats", msCat, db, docList, req, res);
      });
    }
  );

  router.get(
    "/getEtfFlow/assetCategory",
    passport.authenticate("jwt-auth", { failureRedirect: "/#/login" }),
    (req, res) => {
      var db;
      process.env.MONGODB_DB
        ? (db = client.db(process.env.MongoClient))
        : (db = client.db("Floomberg"));
      // store the array returned by the map function
      let docList = [];
      req.query.assetCats.map(assetCat => {
        getCat("assetCats", assetCat, db, docList, req, res);
      });
    }
  );

  return router;
};

module.exports = etfFlowRouter;
