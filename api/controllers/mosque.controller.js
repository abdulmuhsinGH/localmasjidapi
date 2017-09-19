const _ = require("lodash");
const {ObjectID} = require("mongodb")

var Mosque = require("../model/mosque.model");




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

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    var prayerTimes = await Mosque.findPrayerTimesOfAMosque(id);
    
    if(!prayerTimes){
      return res.status(404).send();
    }

    if(req.header("x-auth")){
      res.header("x-auth", req.header("x-auth"));
    }

    res.status(200).send(prayerTimes);
  }catch(err){
  	res.status(400).send();
  }
}

var viewMosquesNearAUser = async(req, res)=>{
  try{
    var location = req.params.location.split(',');
    var maxDistance = req.params.distance/6371; //convert distance in kilometers to radians 

    var mosques = Mosque.findAllMosquesCloseToALocationWithinMaxDistance(location,maxDistance);
    
    if(!mosques){
      return res.status(404).send();
    }

    if(req.header("x-auth")){
      res.header("x-auth", req.header("x-auth"));
    }

    res.status(200).send(mosques);

  }catch(err){
  	res.status(400).send();
  }
}


module.exports = {addMosque, viewMosqueDetails,viewMosquePrayerTimes}