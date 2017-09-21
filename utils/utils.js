const validator = require("validator");

var isValidCoordinates = (longitude,latitude)=>{
  if(!longitude || !latitude){
    return false;
  }

  if(longitude<(-180) || longitude>180){
  	return false;
  }

  if(latitude<(-90) || latitude>90){
  	return false;
  }

  return true;

};

/*
var calcDistance = (longitude1, latitude1, longitude2, latitude2)=>{

}*/


module.exports = {isValidCoordinates}