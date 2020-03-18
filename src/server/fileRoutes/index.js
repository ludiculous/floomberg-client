const MongoClient = require('mongodb').MongoClient;
const dbUrl = 'mongodb://localhost/27017';
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const fs = require('fs');
const XLSX = require('xlsx');
const validationMethods = require('./validateEntry')();

const removeFile = (filepath) => {
  fs.unlink(filepath, (err)=>{
    if(err) return console.log(err);
    console.log('files deleted successfully');
  });
}

const getFullDate = (date) => {
  return date ? (date.getMonth() + 1) + '/' + date.getDate()+ '/' +  date.getFullYear() : ""
}

const readFile = (wb , collection, res, category, uploadType, sFileName) => {
  let docs = [];

    for (var sheetName in wb.Sheets) {
        console.log("sheetName: ", sheetName);
        let sheet = wb.Sheets[sheetName];
        let currRow = 1;
        let currCol = 'A';
        let symbolCell = sheet[`${currCol}${currRow}`];
        let dataRow = 2;
        let dataCol = currCol;
        let rowCell = sheet[`${dataCol}${dataRow}`];
          while (rowCell) {
            let symbol = '';
            let tna = '';
            let flow = '';
            let nav_prcnt = '';
            let flow_tna_ratio = '';
            let asset_class = '';
            let ms_cat = '';
            let entry = {};
            let date = new Date(rowCell.w);
            let dateId = getFullDate(date);

            date.setHours(date.getHours() + 8);
            date = new Date(date);

            switch(category){
              case "US ETF":

                if(uploadType === "daily") {

                  symbol = sheet[`${incrementCol(dataCol, 1)}${dataRow}`] ? sheet[`${incrementCol(dataCol, 1)}${dataRow}`] .w.split(' ')[0] : '';
                  flow = sheet[`${incrementCol(dataCol, 2)}${dataRow}`] ? sheet[`${incrementCol(dataCol, 2)}${dataRow}`].v : 0;
                  tna = sheet[`${incrementCol(dataCol, 3)}${dataRow}`] ? sheet[`${incrementCol(dataCol, 3)}${dataRow}`].v : 0;
                  nav_prcnt = sheet[`${incrementCol(dataCol, 4)}${dataRow}`] ? sheet[`${incrementCol(dataCol, 4)}${dataRow}`].v : 0;
                  flow_tna_ratio = sheet[`${incrementCol(dataCol, 5)}${dataRow}`] ? sheet[`${incrementCol(dataCol, 5)}${dataRow}`].v : 0;

                  entry.t = symbol;
                  entry._id = {date: dateId, t:symbol};
                  entry.date = date;
                  entry.flow = parseFloat(flow);
                  entry.tna = parseFloat(tna);
                  entry.nav_prcnt = parseFloat(nav_prcnt);
                  entry.flowTna = parseFloat(flow_tna_ratio);
                } else {
                  // the uploadType is category
                  symbol = rowCell.w ? rowCell.w.split(' ')[0] : '';
                  asset_class = sheet[`${incrementCol(dataCol, 1)}${dataRow}`] ? sheet[`${incrementCol(dataCol, 1)}${dataRow}`].v : '';
                  ms_cat = sheet[`${incrementCol(dataCol, 2)}${dataRow}`] ? sheet[`${incrementCol(dataCol, 2)}${dataRow}`].v : '';

                  entry.t = symbol;
                  entry.aC = asset_class;
                  entry.msC = ms_cat;
                }
              break;

              case "International ETF":
                if(uploadType === "daily") {
                  symbol = sheet[`${incrementCol(dataCol, 1)}${dataRow}`] ? sheet[`${incrementCol(dataCol, 1)}${dataRow}`].w.split(' ')[0] : '';
                  flow = sheet[`${incrementCol(dataCol, 2)}${dataRow}`] ? sheet[`${incrementCol(dataCol, 2)}${dataRow}`].v : 0;
                  tna = sheet[`${incrementCol(dataCol, 3)}${dataRow}`] ? sheet[`${incrementCol(dataCol, 3)}${dataRow}`].v : 0;
                  nav_prcnt = sheet[`${incrementCol(dataCol, 4)}${dataRow}`] ? sheet[`${incrementCol(dataCol, 4)}${dataRow}`].v : 0;
                  flow_tna_ratio = sheet[`${incrementCol(dataCol, 5)}${dataRow}`] ? sheet[`${incrementCol(dataCol, 5)}${dataRow}`].v : 0;

                  entry.t = symbol;
                  entry._id = {date: dateId, t:symbol};
                  entry.date = date;
                  entry.flow = parseFloat(flow);
                  entry.tna = parseFloat(tna);
                  entry.nav_prcnt = parseFloat(nav_prcnt);
                  entry.flowTna = parseFloat(flow_tna_ratio);
                } else {
                  symbol = rowCell.w ? rowCell.w.split(' ')[0] : '';
                  domiciles = sheet[`${incrementCol(dataCol, 1)}${dataRow}`] ? sheet[`${incrementCol(dataCol, 1)}${dataRow}`].v : '';
                  geo_focus = sheet[`${incrementCol(dataCol, 2)}${dataRow}`] ? sheet[`${incrementCol(dataCol, 2)}${dataRow}`].v : '';
                  mkt_cap_focus = sheet[`${incrementCol(dataCol, 3)}${dataRow}`] ? sheet[`${incrementCol(dataCol, 3)}${dataRow}`].v : '';
                  asset_class = sheet[`${incrementCol(dataCol, 4)}${dataRow}`] ? sheet[`${incrementCol(dataCol, 4)}${dataRow}`].v : '';
                  fund_strategy = sheet[`${incrementCol(dataCol, 5)}${dataRow}`] ? sheet[`${incrementCol(dataCol, 5)}${dataRow}`].v : '';

                  entry.t = symbol;
                  entry.dom = domiciles;
                  entry.geo = geo_focus;
                  entry.asC = asset_class;
                  entry.fStrat = fund_strategy;
                  entry.mcf = mkt_cap_focus;
                }
              break;

              case "Futures":
                if(uploadType === "daily") {
                  let future_cat =  sheet[`${incrementCol(dataCol, 1)}${dataRow}`] ? sheet[`${incrementCol(dataCol, 1)}${dataRow}`].v : '';
                  let future_notional = sheet[`${incrementCol(dataCol, 2)}${dataRow}`] ? sheet[`${incrementCol(dataCol, 2)}${dataRow}`].v : '';
                  let future_flow = sheet[`${incrementCol(dataCol, 3)}${dataRow}`] ? sheet[`${incrementCol(dataCol, 3)}${dataRow}`].v : '';
                  let future_agg = sheet[`${incrementCol(dataCol, 4)}${dataRow}`] ? sheet[`${incrementCol(dataCol, 4)}${dataRow}`].v : '';
                  let future_pc = sheet[`${incrementCol(dataCol, 5)}${dataRow}`] ? sheet[`${incrementCol(dataCol, 5)}${dataRow}`].v : '';
                  let exp_cell = sheet[`${incrementCol(dataCol, 6)}${dataRow}`] ? sheet[`${incrementCol(dataCol, 6)}${dataRow}`].w : '';
                  let exp_date = new Date(exp_cell);
                  let exp_dateId = getFullDate(exp_date);
                  exp_date.setHours(exp_date.getHours() + 8);
                  exp_date = new Date(exp_date);

                  entry.date = date;
                  entry.category = future_cat;
                  entry.notional = future_notional;
                  entry.flow = future_flow;
                  entry.agg_l = future_agg;
                  entry.price_c = future_pc;
                  entry.exp_d = exp_date;
                  entry._id = {exp_d: exp_dateId, date: dateId}

                } else {

                }

              break;
            }
            //console.log(entry);
            docs.push(entry);
            //validationMethods.findDuplicates(entry, res);
            rowCell = sheet[`${dataCol}${++dataRow}`];
            //console.log(symbol)
          }

        sheet = null;
    }
  // insert to mongoose documents here
  insertDocuments(collection, docs, res, sFileName)
  wb = null;
}

const insertDocuments = (collection, docsArr, res, sFileName) => {
  if (docsArr && docsArr.length) {
    // Insert some documents
    console.log(sFileName)
    collection.insertMany(docsArr,(err, result) => {
      // recursively goes through the stack of files
      // unlink file in directory after db insert
      // if results is null go update
      if(result === null) {
        updateDocuments(collection, docsArr, res, sFileName)
        res.send({message: "existing documents have been updated"})
      } else {
        res.send({message: "succesfully inserted the db"})
        removeFile(`uploads/${sFileName}`);
      }
    console.log(`successfully inserted ${result}`)
    });
  }
}

const updateDocuments = (collection, docsArr, res, sFileName) => {
  let uC = 0;

  docsArr.forEach((uQ)=>{
    collection.updateOne({_id: uQ._id}, {$set: uQ}, {upsert: true}, (err, result)=>{
      //console.log("uQ", uQ)
      //console.log(result)
      console.log("updating documents")
      uC++;
    })
  })

  if(uC === docsArr.length) {
    removeFile(`uploads/${sFileName}`);
    res.send({message: "successfully updated the db"})
    console.log("finished updating db")
  }
}

const incrementCol = (s, num) => {
  if (!s) {
    return '';
  }
  let res = '';

  let carry = 0;
  // Want 65 - 90
  for (let i = s.length - 1; i >= 0; i--) {
    let numVal = s.charCodeAt(i) - 65; // 89 - 65 = 24
    // Increment the most right digit
    if (i == s.length - 1) {
      numVal += num; // 25
    }
    numVal += carry;
    carry = Math.max(0, Math.floor(numVal / 26));
    numVal %= 26; // Want a range of 0 - 25
    res = String.fromCharCode(numVal + 65) + res;
  }
  if (carry > 0) { // Carry is non zero start for digits, so we use 64 here
    res = String.fromCharCode(carry + 64) + res;
  }
  return res;
};

const getColName = (category) => {
  let collectionName = '';
    switch(category) {
      case "US ETF":
      collectionName = "EtfFlow";
      break;
      case "International ETF":
      collectionName = "IntEtfFlow";
      break;
      case "Futures":
      collectionName = "FutureFlow";
      break;
    }
  return collectionName;
}

const jsonWrite = (req, res, jsonData, fileName) => {
  let eType = req.query.eType;
  console.log("etype:", eType)
  let rType = '';
  let header = null;
  switch(eType) {
    case "Ticker":
    header = ["Date","Ticker","TNA","Flow","Nav_Prcnt","Flow_TNA_Ratio"];
    rType = "ticker";
    break;

    case "contract":
    header = ["Date", "Exp_Date", "Flow", "Notional", "Price_Ch", "Flow_Notional"];
    rType = "contract";
    break;

    case "summation":
    header = ["Date", "Flow_Sum", "Notional_Sum", "Price_Ch", "Flow_Notional"];
    rType = "summation";
    break;

    case "aggregation":
    header = ["Date", "Flow_Sum", "Notional_Sum", "Price_Ch", "Flow_Notional"];
    rType = "summation";
    break;

    case "Morning Star":
    header = ["Date", "Flow_Sum", "TNA_Sum", "Nav_Prcnt_Sum", "Flow_TNA_Ratio"];
    rType = "aggregation";
    break;

    case "Asset":
    header = ["Date", "Flow_Sum", "TNA_Sum", "Nav_Prcnt_Sum", "Flow_TNA_Ratio"];
    rType = "aggregation";
    break;

    case "International Etf Categories":
    header = ["Date", "Flow_Sum", "TNA_Sum", "Nav_Prcnt_Sum", "Flow_TNA_Ratio"];
    rType = "aggregation";
    break;
  }

  console.log("rType:", rType)
  let excelData = jsonData.map((item, i)=>{
    // if ticker
    return item.docs
    .filter((doc, j)=> doc.date || doc._id.date)
    .map((doc, k)=>{

      let date_obj = null;
      let formatted_date = null;
      switch(rType){
        case "ticker":
        date_obj = new Date(doc.date);
        formatted_date = (date_obj.getMonth() + 1) + '/' + date_obj.getDate() + '/' +  date_obj.getFullYear();
          return {
            Date: formatted_date,
            Ticker: doc.t,
            TNA: doc.tna,
            Flow: doc.flow,
            Nav_Prcnt: doc.nav_prcnt,
            Flow_TNA_Ratio: doc.flowTna
          }
          break;

          case "contract":
            date_obj = new Date(doc.date)
            formatted_date = (date_obj.getMonth() + 1) + '/' + date_obj.getDate() + '/' +  date_obj.getFullYear()
            return {
              Date: formatted_date,
              Exp_Date: doc.exp_d,
              Flow: doc.flow,
              Notional: doc.notional,
              Price_Ch: doc.price_c,
              Flow_Notional: doc.flow/doc.notional,
            }
            break;

          case "aggregation":
            //date_obj = new Date(doc._id.date)
            date_obj = new Date(doc.date);
            formatted_date = (date_obj.getMonth() + 1) + '/' + date_obj.getDate() + '/' +  date_obj.getFullYear()
            return {
              Date: formatted_date,
              Flow_Sum: doc.flowSum,
              TNA_Sum: doc.tnaSum,
              Nav_Prcnt_Sum: doc.nav_prcntAvg,
              Flow_TNA_Ratio: doc.flow_tna_ratio
            }
          break;

          case "summation":
            //date_obj = new Date(doc._id.date)
            date_obj = new Date(doc.date);
            formatted_date = (date_obj.getMonth() + 1) + '/' + date_obj.getDate() + '/' +  date_obj.getFullYear()
            return {
              Date: formatted_date,
              Flow_Sum: doc.flow,
              Notional_Sum: doc.notional,
              Price_Ch: doc.price_change,
              Flow_Notional: doc.flow / doc.notional
            }
          break;
        }
    })
  });

  //console.log(excelData)
  let wb = XLSX.utils.book_new();
  //console.log(excelData)
  /***
   *
   * the filtered data ready to be written to json sheet
   */

  excelData.forEach((doc, i)=>{
    let ws = XLSX.utils.json_to_sheet(doc, {
      header: header
    })
    console.log(eType)
    XLSX.utils.book_append_sheet(wb, ws, rType === "individual" ? doc[i].Ticker : `${jsonData[i].category}` || `sheet${i+1}`);
  })

  XLSX.writeFileAsync(`exports/${fileName}`, wb, ()=>{
    console.log("finished writing")
    res.send({filename: fileName})
  });
  //res.send
}

const fileRouter = (router, client) => {
  // 2nd argument is for multer middleware, single sheet gets name from client side  file input name
  router.post('/uploadExcel', upload.single('sheet'), (req,res)=>{
    var db;
    process.env.MONGODB_DB ? db = client.db(process.env.MONGODB_DB) : db = client.db('Floomberg');
    console.log(req.file)
    let sFile  = req.file;
    let sFileName = sFile.filename;
    let wb = XLSX.readFile(sFile.path);

    let category = req.query.category;
    let collectionName = getColName(category);

    console.log(category)
    console.log(collectionName)
    // check for a query string to fill in the collection details.
    let collection = db.collection(`${collectionName}`);
    let uploadType = req.query.upType;
    console.log(uploadType)

    readFile(wb , collection, res, category, uploadType, sFileName);
  })

  router.post('/exportJSON', (req, res)=>{

    console.log('exporting json file')
    const dHash = Date.now();
    const eType = req.query.eType;
    const fileName = `${eType}_${dHash}.xlsx`;
    const jsonData = req.body
    //console.log(jsonData);
    console.log(fileName)
    // run write function
    jsonWrite(req, res, jsonData, fileName)
    //res.download(`exports/Ticker_1549011109655.xlsx`, `Ticker_1549011109655.xlsx`)
  })

  router.get('/downloadExcel', (req, res)=>{
    const fileName = req.query.filename;

    console.log('from get request to download')
    res.download(`exports/${fileName}`, fileName,()=>{
      removeFile(`exports/${fileName}`);
    });
  })

  return router
}

module.exports = fileRouter