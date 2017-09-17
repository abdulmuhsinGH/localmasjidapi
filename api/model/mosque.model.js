const mongoose = require("../../db/db");

var prayertimesSchema = new mongoose.Schema({ 
  name:{type:String}, 
  time:{type:Date} 
});

var mosqueSchema = new mongoose.Schema({
  name:{type: String, required:true, minlength:1}, 
  description:{type:String, minlength:10},
  location: {type:[Number], index:'2d', required:true},
  prayer_times: [prayertimesSchema],
  verified: {type:Boolean, default:false},
  created_at:{type:Date, default:Date.now}
});

var Mosque = mongoose.model('Mosque', mosqueSchema);


module.exports = Mosque;