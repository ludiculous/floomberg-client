const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbURL = process.env.MONGODB_DB || 'Floomberg';

const futureFlowRouter = (router, client)=> {

  router.get('/getFutureFlow/contract', (req, res) => {
      //assert.equal(null, err);
      console.log("connected to mongodb")
      var db;
      process.env.MONGODB_DB ? db = client.db(process.env.MONGODB_DB) : db = client.db('Floomberg');
      //var db = client.db('heroku_w7k9jtvz');
      //Build out the date range query object
      let dateQueryObj = Object.assign({},
          req.query.from_date ?
              { $gte: new Date(req.query.from_date) } : null,
          req.query.to_date ?
              { $lte: new Date(req.query.to_date) } : null
          );
      // Build out the full query object
      req.query.contracts = req.query.contracts.map(c => new Date(c));
      let queryObj = Object.assign({},
          req.query.name ? { category: req.query.name } : null,
          req.query.from_date || req.query.to_date ?
              { date: dateQueryObj } : null,
          req.query.contracts && req.query.contracts.length ?
              { expiration_date : { $in: req.query.contracts } } : null);

      console.log(queryObj)
      db.collection('FutureFlow').find(queryObj).toArray(function(err, docs) {
          //assert.equal(err, null);
          res.send(docs);
          //client.close();
      });
  });

  router.get('/getFutureFlow/summation', (req, res) => {
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
          price_change: { $avg: '$price_change' }
        } }])
        .toArray(function(err, docs) {
          //assert.equal(err, null);
          res.send(docs);
          //client.close();
        });
  });


  router.get('/getFutureFlow/aggregation', (req, res) => {

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
        andQuery.push({ aggregation_level : { $in: req.query.aggregations } });
      }
      db.collection('FutureFlow').aggregate([
        { $match: {
          $and: andQuery
        } },
        { $group: {
          _id: {
            aggregation_level: '$aggregation_level',
            date: '$date'
          },
          flow: { $sum: '$flow' },
          notional: { $sum: '$notional' },
          price_change: { $avg: '$price_change' }
        } }])
        .toArray(function(err, docs) {
          //assert.equal(err, null);
          res.send(docs);
          //client.close();
        });
  });

  /** Deprecated - just use the contracts in Models.js */
  router.get('/getContracts', (req, res) => {
      //assert.equal(null, err);
      //assert.notEqual(null, req.query.category);
      //var db = global.dbClient.db('Floomberg');
      var db;
      process.env.MONGODB_DB ? db = client.db(process.env.MONGODB_DB) : db = client.db('Floomberg');

      db.collection('FutureFlow').distinct(
        'expiration_date',
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
