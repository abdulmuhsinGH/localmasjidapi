const _ = require("lodash");
const {ObjectID} = require("mongodb")

var Mosque = require("../model/mosque.model");
const {isValidCoordinates} = require("../../utils/utils");




var addMosque = async (req, res)=>{
  try{
    var body = _.pick(req.body, ["name","location"]);

    var mosque = new Mosque(body);
    await mosque.save();
    res
      .header("x-auth", req.token)
      .status(201)
      .send(mosque);

  }catch(err){
    console.log(err);
  	res.status(400).send()
  }
  
}

var addPrayerTimesForAMosque = async(req, res)=>{
  try{
    var prayerTimes = req.body.prayertimes;
    var mosqueId = req.params.id;

    if (!ObjectID.isValid(mosqueId)) {
      return res.status(404).send();
    }

    if(!prayerTimes){
      return res.status(400).send();
    }
    
    var mosque = await Mosque.findOneAndUpdate({_id:mosqueId}, {$set:{prayer_times:prayerTimes}}, {new:true});
     
    if(!mosque){
      return res.status(404).send();
    }
     //await mosque.save();
    res
      .header("x-auth", req.token)
      .status(200)
      .send(mosque);

  }catch(err){
  	console.log(err);
    res.status(400).send(err);
  }
  
}

var viewMosqueDetails = async(req, res)=>{
  try{

  	var id = req.params.id;

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    var mosque = await Mosque.findMosqueWithDetails(id);
    
    if(!mosque){
      return res.status(404).send();
    }

    if(req.header("x-auth")){
      res.header("x-auth", req.header("x-auth"));
    }

    res.status(200).send(mosque);
  }catch(err){
  	console.log(err);
  	res.status(400).send();
  }
}

var viewMosquePrayerTimes = async(req, res)=>{
  try{
    var id = req.params.id;

    if(req.header("x-auth")){
      res.header("x-auth", req.header("x-auth"));
    }
    
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    var prayerTimes = await Mosque.findPrayerTimesOfAMosque(id);
    
    if(!prayerTimes){
      return res.status(404).send();
    }

    res.status(200).send(prayerTimes);
  }catch(err){
  	res.status(400).send(err);
  }
}

var viewMosquesNearAUser = async(req, res)=>{
  try{
  	
    var longitude = req.query.longitude;
    var latitude = req.query.latitude;
    var maxDistance = (req.query.maxdistance ? parseFloat(req.query.maxdistance) : 8);
    
    maxDistance = maxDistance/6371; //convert distance in kilometers to radians

    if(req.header("x-auth")){
      res.header("x-auth", req.header("x-auth"));
    }

    if(!isValidCoordinates(longitude, latitude)) {
      return res.status(400).send();
    } 

    var mosques =  await Mosque.findAllMosquesCloseToALocationWithinMaxDistance(longitude, latitude, maxDistance);
   
    if(!mosques){
      return res.status(404).send();
    }

    res.status(200).send(mosques);

  }catch(err){
  	
  	res.status(400).send(err);
  }
}


module.exports = {addMosque, viewMosqueDetails,viewMosquePrayerTimes,viewMosquesNearAUser,addPrayerTimesForAMosque}