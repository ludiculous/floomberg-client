const MongoClient = require('mongodb').MongoClient;
const dbUrl = 'mongodb://localhost:27017';

const intEtfFlowRouter = (router, client) => {
  router.get('/getIntEtfFlow/categoryList', (req, res)=>{
    var db;
    process.env.MONGODB_DB ? db = client.db(process.env.MONGODB_DB) : db = client.db('Floomberg');
    let catType = req.query.catType ? req.query.catType : null;

    db.collection('IntEtfFlow').distinct(catType, (err, docs)=>{
      if(err) {
        console.log(err)
      }
      res.send(docs)
    })
  })

  router.get('/getIntEtfFlow/ticker', (req, res)=>{
    var db;
    process.env.MONGODB_DB ? db = client.db(process.env.MONGODB_DB) : db = client.db('Floomberg');
    let dateQueryObj = Object.assign({},
      req.query.from_date ?
        { $gte: new Date(req.query.from_date) } : null,
      req.query.to_date ?
        { $lte: new Date(req.query.to_date) } : null
      );

    let queryObj = Object.assign({},
      req.query.from_date || req.query.to_date ?
        { date: dateQueryObj } : null,
      req.query.symbols && req.query.symbols.length ?
        { ticker : { $in: req.query.symbols } } : null);

    db.collection('IntEtfFlow').find(queryObj).toArray(function(err, docs) {
      if(err) {
        console.log(err)
      }
      let document = [];
      document.push({docs:{data:[docs]}})
      res.send(document)
    })
  })

  const getCat = (catType, Cat, db, docList, req, res) => {

  }

  router.get('/getIntEtfFlow/intCategory', (req, res)=> {
    var db;
    process.env.MONGODB_DB ? db = client.db(process.env.MongoClient) : db = client.db('Floomberg');
    // store the array returned by the map function
    let docList = [];
    // category types
    // category chosen

    req.query.assetCats.map((assetCat)=>{
      getCat('assetCats', assetCat, db , docList, req, res)
    })
  })

  return router;
}

module.exports = intEtfFlowRouter