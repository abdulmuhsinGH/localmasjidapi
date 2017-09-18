const mongoose = require("../../db/db");

var prayertimesSchema = new mongoose.Schema({ 
  name:{type:String}, 
  time:{type:Date} 
});

var MosqueSchema = new mongoose.Schema({
  name:{type: String, required:true, minlength:1}, 
  description:{type:String, minlength:10},
  location: {
    type:[Number], 
    index:'2d', 
    required:true, 
    validate:{
      validator:locationIsUnique,
      message:"A Mosque is already in this location"
    }},
  prayer_times: [prayertimesSchema],
  verified: {type:Boolean, default:false},
  created_at:{type:Date, default:Date.now}
});

function locationIsUnique(location){
  var Mosque = this;
  //console.log(Mosque);
  
  	return new Promise((resolve,rejct)=>{
  	  resolve(true);
  	})

}


var Mosque = mongoose.model('Mosque', MosqueSchema);


module.exports = Mosque;