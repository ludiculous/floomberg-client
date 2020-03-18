var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var  iecSchema = new Schema({
  t:  String,
  date: { type: Date},
  flow: Number,
  nav_prcnt: Number,
  flowTna: Number
});

export const IntEtf_Cat = mongoose.model('IntEtf_Cat', iecSchema);