const entries = {};
const duplicates = [];
const validationMethods = () => {

  const findDuplicates = (entry, res)=>{
    var key = JSON.stringify(entry)
    if(entries.hasOwnProperty(key)) {
      console.log("error duplicate found")
      duplicates.push(entry);
      console.log(duplicates);
      throw new Error(`Error found at ${key}`);
    } else {
      entries[key] = entry._id
      console.log(entries)
      //console.log(entry)
    }
  }

  return {
    findDuplicates: findDuplicates
  }
}

module.exports = validationMethods;