const MongoClient = require('mongodb').MongoClient;
const dbUrl = 'mongodb://localhost:27017';

const etfFlowRouter = (router, client) => {
  router.get('/getEtfFlow/tickerList', (req,res)=>{
    var db;
    process.env.MONGODB_DB ? db = client.db(process.env.MONGODB_DB) : db = client.db('Floomberg');

    db.collection('EtfFlow').distinct("ticker", (err, docs)=>{
      if(err) {
        console.log(err)
      }
      res.send(docs)
    })
  })

  router.get('/getEtfFlow/ticker', (req, res)=> {
    var db;
    process.env.MONGODB_DB ? db = client.db(process.env.MONGODB_DB) : db = client.db('Floomberg');
    // create a query for every ticker symbol in qs

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
    console.log("symbols: ", req.query.symbols)
    console.log(queryObj)

    db.collection('EtfFlow').find(queryObj).toArray(function(err, docs) {
        if(err) {
          console.log(err)
        }
        let document = [];
        document.push({docs:{data:[docs]}})
        res.send(document)
    })
  })

  const getCat = (catType, Cat, db, docList, req, res) => {
    let catQuery;
    if(catType === 'msCats') {
      catQuery = {ms_cat: Cat}
    }

    if(catType === 'assetCats') {
      catQuery = {$and: [{asset_class: Cat}, {short:{$ne:"-1"}}]}
    }

    db.collection('EtfFlow').find(catQuery).toArray((err, docs)=>{
      let tickers = docs.map((doc)=>doc.ticker)
      let andQuery = []

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
      if (req.query.categories && req.query.categories.length) {
        andQuery.push({ ticker : { $in: tickers } });
      }

      db.collection('EtfFlow').aggregate(
        [
          {
            $match: {
              $and: andQuery
            }
          },
          {
            $group: {
              _id: {
                ticker: '$ticker',
                date: '$date',
              },
              flowSum: { $sum: '$flow' },
              tnaSum: { $sum: '$tna' },
              nav_prcntAvg: { $avg: '$nav_prcnt' }
              //need conditional to check if $tna is at least 0
              //flow_tna_ratio: {$sum:{$divide: ["$flow", "$tna"]}}
            }
          },{
            $project: {
              ticker: 1,
              date: 1,
              flowSum: 1,
              tnaSum: 1,
              nav_prcntAvg: 1,
              flow_tna_ratio: {
                $cond: {
                  if: { $gt: [ "$tnaSum", 0 ] },
                  then: {
                    $divide: ["$flowSum", "$tnaSum"]
                  },
                  else: ""
                }
              }
            }
          }
        ]
        ).toArray((err, docsCat)=>{
          if(err) {
            console.log(err)
          }
          docList.push({data: docsCat})
          if(docList.length == req.query[catType].length) {
            console.log("reached length")
            res.send({documents: docList})
          }
        })
    })
  }

  router.get('/getEtfFlow/msCategory', (req,res) => {
    var db;
    process.env.MONGODB_DB ? db = client.db(process.env.MongoClient) : db = client.db('Floomberg');
    // store the array returned by the map function
    let docList = [];
    req.query.msCats.map((msCat)=>{
      getCat('msCats', msCat, db , docList, req, res)
    })
  })

  router.get('/getEtfFlow/assetCategory', (req, res)=> {
    var db;
    process.env.MONGODB_DB ? db = client.db(process.env.MongoClient) : db = client.db('Floomberg');
    // store the array returned by the map function
    let docList = [];
    req.query.assetCats.map((assetCat)=>{
      getCat('assetCats', assetCat, db , docList, req, res)
    })
  })

  return router;
}

module.exports = etfFlowRouter