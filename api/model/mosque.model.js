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
    index:'2dsphere', 
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
  
  	return new Promise((resolve,rejct)=>{
  	  resolve(true);
  	})

}

MosqueSchema.statics.findMosqueWithDetails = function(mosqueId){
	var Mosque = this;

    return  Mosque.findOne({_id:mosqueId}).then((mosque)=>{

      if(!mosque){
        return Promise.reject(`Mosque with this ${mosqueId} does not exist`)
      }

      return new Promise((resolve, reject)=>{
        resolve(mosque);
      });

    });
}

MosqueSchema.statics.findPrayerTimesOfAMosque = function(mosqueId){
	var Mosque = this;

	return Mosque.findMosqueWithDetails(mosqueId).then((mosque)=>{

	  return Promise.resolve(mosque.prayer_times);
	});
}

MosqueSchema.statics.findAllMosquesCloseToALocationWithinMaxDistance = function(location,maxDistance){
  var Mosque = this;

  Mosque
    .where('location')
    .near({center:[location[0],location[1]], maxDistance:5, spherical: true})
    .then((mosques)=>{
      if(!mosques){
        return Promise.reject(`No mosque within this ${location}`);
      }

      return Promise.resolve(mosques);
    });

}


var Mosque = mongoose.model('Mosque', MosqueSchema);


module.exports = Mosque;