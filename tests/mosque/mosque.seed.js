const {ObjectID} = require("mongodb");
const moment = require("moment");


const Mosque = require("../../api/model/mosque.model");

const seedMosqueOneObjId = new ObjectID();
const seedMosqueTwoObjId = new ObjectID();

const mosques =[
  {
    _id:seedMosqueOneObjId,
    name:"Mosque One",
    description:"the first mosque",
    location:[-0.029201, 5.664092],
    prayer_times:[
      {name:"Fajr",  time:moment({ hour:5, minute:00 })},
      {name:"Zuhr",  time:moment({ hour:12, minute:05 })},
      {name:"Asr",  time:moment({ hour:15, minute:00 })},
      {name:"Maghrib",  time:moment({ hour:18, minute:10 })},
      {name:"Isha",  time:moment({ hour:7, minute:00 })},
      {name:"Juma",  time:moment({ hour:13, minute:00 })}]
  },
  {
    _id:seedMosqueTwoObjId,
    name:"Mosque Two",
    description:"the second mosque",
    location:[-0.049201, 5.664092],
    prayer_times:[
      {name:"Fajr",  time:moment({ hour:5, minute:00 })},
      {name:"Zuhr",  time:moment({ hour:12, minute:05 })},
      {name:"Asr",  time:moment({ hour:15, minute:00 })},
      {name:"Maghrib",  time:moment({ hour:18, minute:10 })},
      {name:"Isha",  time:moment({ hour:7, minute:00 })},
      {name:"Juma",  time:moment({ hour:13, minute:00 })}]
  }
]
const populateMosques = (done)=>{

  Mosque.remove({}).then(()=>{
    var mosqueOne = new Mosque(mosques[0]).save();
    var mosqueTwo = new Mosque(mosques[1]).save();

    return Promise.all([mosqueOne, mosqueTwo]);
  }).then(()=>done()).catch((err)=>done(err));
}


module.exports = {mosques,populateMosques}