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
    console.log(id)
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    var mosque = await Mosque.findOne({_id:id});
    
    if(!mosque){
      return res.status(404).send();
    }

    if(req.header("x-auth")){
      res.header("x-auth", req.header("x-auth"));
    }

    res.status(200).send(mosque);
  }catch(err){
  	res.status(400).send();
  }
}

var viewMosquePrayerTimes = async(req, res)=>{
  try{
    var id = req.params.id;
    console.log(id)
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    var prayerTimes = await Mosque.findOne({_id:id}, 'prayer_times');
    
    if(!prayerTimes){
      return res.status(404).send();
    }

    if(req.header("x-auth")){
      res.header("x-auth", req.header("x-auth"));
    }

    res.status(200).send(prayerTimes);
  }catch(err){
  	console.log(err);
  	res.status(400).send();
  }
}



module.exports = {addMosque, viewMosqueDetails,viewMosquePrayerTimes}