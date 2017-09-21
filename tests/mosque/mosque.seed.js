const {ObjectID} = require("mongodb");
const moment = require("moment");
const faker = require("faker");


const Mosque = require("../../api/model/mosque.model");

const mosques = [];
const nearbyLocations= [
  {longitude:0.24401664483889363,latitude:5.571053357161775},
  {longitude:-0.24470329034670613,latitude:5.569857402115306},
  {longitude:0.241785046938503,latitude:5.567892613539909},
  {longitude:-0.23843765008791706,latitude:5.5686187318221885}]

for (var i = 7; i >= 0; i--) {
  var longitude = 0;
  var latitude = 0
  if(i<4){
    longitude = nearbyLocations[i].longitude;
    latitude = nearbyLocations[i].latitude;
  }
  else{
    longitude = faker.address.longitude();
    latitude = faker.address.latitude();
  } 
  mosques[i] =  {
    _id:new ObjectID(),
    name:faker.random.word(),
    description:faker.random.words(10),
    location:[longitude, latitude],
    prayer_times:[
      {name:"Fajr",  time:moment({ hour:5, minute:00 })},
      {name:"Zuhr",  time:moment({ hour:12, minute:05 })},
      {name:"Asr",  time:moment({ hour:15, minute:00 })},
      {name:"Maghrib",  time:moment({ hour:18, minute:10 })},
      {name:"Isha",  time:moment({ hour:7, minute:00 })},
      {name:"Juma",  time:moment({ hour:13, minute:00 })}]
  };
}
//mosque with no prayer times
mosques[8] = {
    _id:new ObjectID(),
    name:"Mosque with no prayer_times",
    description:faker.random.words(10),
    location:[longitude, latitude]
  };

const populateMosques = (done)=>{

  Mosque.remove({}).then(()=>{
    return Mosque.create(mosques);
  }).then(()=>done()).catch((err)=>done(err));
}

const newPrayerTimes = [
  {name:"Fajr",  time:moment({ hour:4, minute:45 })},
  {name:"Zuhr",  time:moment({ hour:11, minute:55 })},
  {name:"Asr",  time:moment({ hour:15, minute:30 })},
  {name:"Maghrib",  time:moment({ hour:18, minute:20 })},
  {name:"Isha",  time:moment({ hour:7, minute:21 })},
  {name:"Juma",  time:moment({ hour:12, minute:50 })}];


module.exports = {mosques,populateMosques, newPrayerTimes}