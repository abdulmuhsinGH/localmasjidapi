const validator = require("validator");

const isValidCoordinates = (longitude,latitude)=>{
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


module.exports = {isValidCoordinates}
