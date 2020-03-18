const MongoClient = require("mongodb").MongoClient;
const dbUrl = "mongodb://localhost:27017";
const passport = require("passport");

const intEtfFlowRouter = (router, client) => {
  router.get(
    "/getIntEtfFlow/tickerList",
    passport.authenticate("jwt-auth"),
    (req, res) => {
      var db;
      process.env.MONGODB_DB
        ? (db = client.db(process.env.MONGODB_DB))
        : (db = client.db("Floomberg"));

      db.collection("IntEtfFlow").distinct("t", (err, docs) => {
        if (err) {
          console.error(err);
        }
        res.send(docs.sort());
      });
    }
  );

  router.get("/getIntEtfFlow/categoryList", (req, res) => {
    var db;
    process.env.MONGODB_DB
      ? (db = client.db(process.env.MONGODB_DB))
      : (db = client.db("Floomberg"));
    let catType = req.query.catType ? req.query.catType : null;

    db.collection("IntEtfFlow").distinct(catType, (err, docs) => {
      if (err) {
        console.error(err);
      }
      res.send(docs.sort());
    });
  });

  router.get("/getIntEtfFlow/ticker", (req, res) => {
    var db;
    process.env.MONGODB_DB
      ? (db = client.db(process.env.MONGODB_DB))
      : (db = client.db("Floomberg"));
    let dateQueryObj = Object.assign(
      {},
      req.query.from_date ? { $gte: new Date(req.query.from_date) } : null,
      req.query.to_date ? { $lte: new Date(req.query.to_date) } : null
    );

    let documents = [];
    req.query.symbols.forEach(ticker => {
      let queryObj = Object.assign(
        {},
        { date: { $exists: true } },
        req.query.from_date || req.query.to_date
          ? { date: dateQueryObj }
          : null,
        ticker ? { t: ticker } : null
      );

      db.collection("IntEtfFlow")
        .find(queryObj)
        .sort({ date: -1 })
        .toArray(function(err, docs) {
          if (err) {
            console.error(err);
          }
          documents.push({
            category: ticker,
            docs: docs
          });
          if (documents.length === req.query.symbols.length) {
            console.log("reached length", req.query.symbols.length);
            res.send(documents);
          }
        });
    });
  });

  const getCat = (catType, catData, db, req, res) => {
    // get key values from
    let docList = [];
    let catValues = [];

    let categoryQuery = catData.map(cat => {
      //console.log(cat)
      let queryObj = {};
      let key = Object.keys(cat);
      queryObj[key] = cat[key][0];
      catValues.push(cat[key][0]);
      return queryObj;
    });

    console.log(categoryQuery);

    db.collection("IntEtfFlow")
      .find({ $and: categoryQuery })
      .toArray((err, docs) => {
        let tickers = docs.map(doc => doc.t);
        console.log(tickers);
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
        if (categoryQuery && categoryQuery.length) {
          andQuery.push({ t: { $in: tickers } });
        }
        console.log(andQuery);
        db.collection("IntEtfFlow")
          .aggregate([
            {
              $match: {
                $and: andQuery
              }
            },
            {
              $group: {
                _id: {
                  intEtfId: "$_id.date"
                },
                date: { $first: "$date" },
                flowSum: { $sum: "$flow" },
                tnaSum: { $sum: "$tna" },
                nav_prcntAvg: { $avg: "$nav_prcnt" }
              }
            },
            {
              $project: {
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
              console.error(err);
            }

            docList.push({
              category: catValues.join(", "),
              docs: docsCat
            });
            console.log("doclist", docList.length);
            console.log("catType", req.query[catType].length);
            if (docList.length > 0) {
              res.send(docList);
            }
          });
      });
  };

  router.get("/getIntEtfFlow/intCategory", (req, res) => {
    var db;
    process.env.MONGODB_DB
      ? (db = client.db(process.env.MongoClient))
      : (db = client.db("Floomberg"));
    // store the array returned by the map function
    // category types
    // category chosen
    // do a query for all the categories, no
    let catData = req.query.intCategory.map((cat, i) => {
      let intCat = cat.split("$");
      // grab the first item from the array
      let category = intCat.shift();
      let cD = {};
      cD[category] = intCat;

      return cD;
    });
    console.log(catData);
    if (catData.length === req.query.intCategory.length) {
      getCat("intCategory", catData, db, req, res);
    }
  });

  return router;
};

module.exports = intEtfFlowRouter;
