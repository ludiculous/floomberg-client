const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbURL = process.env.MONGODB_DB || 'Floomberg';
const passport = require('passport')
const futureFlowRouter = (router, client)=> {

  router.get('/getFutureFlow/categoryList', passport.authenticate('jwt-auth'), (req, res) => {
    var db;
    process.env.MONGODB_DB ? db = client.db(process.env.MONGODB_DB) : db = client.db('Floomberg');

    db.collection('FutureFlow').distinct("category", (err, docs)=>{
      if(err) {
        console.log(err)
      }
      res.send(docs.sort());
    })
  })

  router.get('/getFutureFlow/contract', passport.authenticate('jwt-auth'), (req, res) => {
    console.log("connected to mongodb")
    var db;
    process.env.MONGODB_DB ? db = client.db(process.env.MONGODB_DB) : db = client.db('Floomberg');
    //Build out the date range query object
    let dateQueryObj = Object.assign({},
        req.query.from_date ?
            { $gte: new Date(req.query.from_date) } : null,
        req.query.to_date ?
            { $lte: new Date(req.query.to_date) } : null
        );
    // Build out the full query object
    // returns an array of expiration dates
    req.query.contracts = req.query.contracts.map(c => new Date(c));
    let documents = [];
    req.query.contracts.forEach((contract)=>{
      let queryObj = Object.assign({},
        {date: {$exists:true}},
        req.query.name ? { category: req.query.name } : null,
        req.query.from_date || req.query.to_date ?
        { date: dateQueryObj } : null,
        contract ?
        { exp_d : contract } : null);

        console.log(queryObj)
        db.collection('FutureFlow').find(queryObj).toArray(function(err, docs) {
          if(err){
            console.err(err)
          }
          documents.push({docs:docs})
          if(documents.length === req.query.contracts.length) {
            res.send(documents);
          }
        });
      })
  });

  router.get('/getFutureFlow/summation', passport.authenticate('jwt-auth'), (req, res) => {
      //assert.equal(null, err);
      //var db = global.dbClient.db('Floomberg');
      var db;
      process.env.MONGODB_DB ? db = client.db(process.env.MongoClient) : db = client.db('Floomberg');
      let andQuery = [];
      let dateQueryObj = {};
      if (req.query.from_date) {
        dateQueryObj['$gte'] = new Date(req.query.from_date);
      }
      if (req.query.to_date) {
        dateQueryObj['$lte'] = new Date(req.query.to_date);
      }
      if (dateQueryObj && Object.keys(dateQueryObj).length) {
        andQuery.push({ date: dateQueryObj });
      }
      if (req.query.name) {
        andQuery.push({ category: req.query.name });
      }
      if (req.query.categories && req.query.categories.length) {
        andQuery.push({ category : { $in: req.query.categories } });
      }
      db.collection('FutureFlow').aggregate([
        { $match: {
          $and: andQuery
        } },
        { $group: {
          _id: {
            category: '$category',
            date: '$date',
          },
          flow: { $sum: '$flow' },
          notional: { $sum: '$notional' },
          price_change: { $avg: '$price_c' }
        } }])
        .toArray(function(err, docs) {
          //assert.equal(err, null);
          let documents = [];
          documents.push({docs:docs})
          res.send(documents);
          //client.close();
        });
  });


  router.get('/getFutureFlow/aggregation', passport.authenticate('jwt-auth'), (req, res) => {

      //assert.equal(null, err);
      //var db = global.dbClient.db('Floomberg');
      var db;
      process.env.MONGODB_DB ? db = client.db(process.env.MONGODB_DB) : db = client.db('Floomberg');

      let andQuery = [];
      let dateQueryObj = {};
      if (req.query.from_date) {
        dateQueryObj['$gte'] = new Date(req.query.from_date);
      }
      if (req.query.to_date) {
        dateQueryObj['$lte'] = new Date(req.query.to_date);
      }
      if (dateQueryObj && Object.keys(dateQueryObj).length) {
        andQuery.push({ date: dateQueryObj });
      }
      if (req.query.aggregations && req.query.aggregations.length) {
        andQuery.push({ agg_l : { $in: req.query.aggregations } });
      }
      db.collection('FutureFlow').aggregate([
        {
          $match: {
            $and: andQuery
          }
        },
        {
          $group: {
            _id: {
              aggregation_level: '$agg_l',
              date: '$date'
            },
            flow: { $sum: '$flow' },
            notional: { $sum: '$notional' },
            price_change: { $avg: '$price_c' }
          }
        },
        {
          $project: {
            date: '$date',
            flow: '$flow',
            notional: '$notional',
            price_change: '$price_change'
          }
        }
        ])
        .toArray(function(err, docs) {
          //assert.equal(err, null);
          let documents = [];
          documents.push({docs:docs})
          res.send(documents);
          //client.close();
        });
  });

  /** Deprecated - just use the contracts in Models.js */
  //passport.authenticate('jwt-auth'),
  router.get('/getFutureFlow/getContracts',  (req, res) => {
      //assert.equal(null, err);
      //assert.notEqual(null, req.query.category);
      //var db = global.dbClient.db('Floomberg');
      var db;
      process.env.MONGODB_DB ? db = client.db(process.env.MONGODB_DB) : db = client.db('Floomberg');

      db.collection('FutureFlow').distinct(
        'exp_d',
        { category: req.query.category },
        function(err, exprDates) {
          //assert.equal(null, err);
          res.send(exprDates);
          //client.close();
        }
      );
  });

  return router;
}

module.exports = futureFlowRouter;
