const _ = require("lodash");

var Mosque = require("../model/mosque.model");




var addMosque = async (req, res)=>{
  try{
    var body = _.pick(req.body, ["name","location"]);

    var mosque = new Mosque(body);
    await mosque.save();
    res
      .header("x-auth", req.token)
      .status(200)
      .send(mosque);

  }catch(err){
    console.log(err);
  	res.status(400).send()
  }
  
}
/*
var viewMosque = async(req, res)=>{
  
}
*/


module.exports = {addMosque}