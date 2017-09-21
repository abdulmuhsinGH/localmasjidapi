const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("mongodb");
const _ = require("lodash");

const app = require("../../server");
const Mosque = require("../../api/model/mosque.model");
const {users} = require("../user/user.seed");
const {mosques, populateMosques, newPrayerTimes} = require("./mosque.seed");

beforeEach(populateMosques);


describe("Add Mosque --/mosque/add",()=>{
  it("should add mosque and return",(done)=>{
    var name ="Mosque";
    var location = [-0.029200, 5.664192];

    request(app)
      .post("/mosque/add")
      .set("x-auth", users[0].tokens[0].token)
      .send({name,location})
      .expect(201)
      .expect((res)=>{
      	expect(res.headers["x-auth"]).toExist();
        expect(res.body._id).toExist();
        expect(res.body.name).toBe(name);
        
      })
      .end((err)=>{
        if(err){
          return done(err);
        }

        Mosque.find({name}).then((mosque)=>{
          expect(mosque).toExist();
          done();
        }).catch((err)=>done(err));
      });
  });

  it("should not add mosque from unauthorized user",(done)=>{
    var name ="Mosque 2";
    var location = [-0.029200, 5.664092];

    request(app)
      .post("/mosque/add")
      .send({name,location})
      .expect(401)
      .end(done);
  });

})

describe("Get information about a  mosque --/mosque/:id",()=>{
  it("should get a mosque and have details about the mosque",(done)=>{
    var mosqueId = mosques[0]._id;
    var mosqueName = mosques[0].name;
    var mosqueLocation = mosques[0].location;

    request(app)
      .get(`/mosque/${mosqueId.toHexString()}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body._id).toExist();
        expect(res.body.name).toBe(mosqueName);
        expect(res.body.location).toInclude(mosqueLocation[0])
        expect(res.body.location).toInclude(mosqueLocation[1])
        expect(res.body.prayer_times[0].name).toBe(mosques[0].prayer_times[0].name);
      })
      .end(done);
  });

  it("should not get details of any mosque using an invalid id",(done)=>{
    var mosqueId = "mosqueid";

    request(app)
      .get(`/mosque/${mosqueId}`)
      .expect(404)
      .end(done);
  });

  it("should get the mosque's prayer times",(done)=>{
    var mosqueId = mosques[0]._id;
    var mosqueName = mosques[0].name;
    var mosqueLocation = mosques[0].location;

    request(app)
      .get(`/mosque/${mosqueId.toHexString()}/prayertimes`)
      .expect(200)
      .expect((res)=>{
        expect(res.body[0].name).toBe(mosques[0].prayer_times[0].name);
      })
      .end(done);
  });

  it("should not get prayertimes of any mosque using an invalid id",(done)=>{
    var mosqueId = "mosqueid";

    request(app)
      .get(`/mosque/${mosqueId}/prayertimes`)
      .expect(404)
      .end(done);
  });
})


describe("Get nearby mosques to a location --/mosque/near/location",()=>{

  it("should get all mosques near the location",(done)=>{

    var userLongitude = '0.24122714746340534';
    var userLatitude =  '5.568447880542366';
    var userMaxDistance = '10';
    
    request(app)
      .get(`/mosque/near/location?longitude=${userLongitude}&latitude=${userLatitude}&maxdistance=${userMaxDistance}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body[0]._id).toExist();
      })
      .end(done);

  });

  it("should not get any mosques near the location",(done)=>{

    var userLongitude = '5.272965428713405';
    var userLatitude =  '6.7917418876871105';
    var userMaxDistance = '10';
    
    request(app)
      .get(`/mosque/near/location?longitude=${userLongitude}&latitude=${userLatitude}&maxdistance=${userMaxDistance}`)
      .expect(404)
      .end(done);

  });

  it("should not get any mosques near the location, if the location is invalid",(done)=>{

    var userLongitude = '5.272965428713405abc';
    var userLatitude =  '6.7917418876871105abc';
    var userMaxDistance = '10';
    
    request(app)
      .get(`/mosque/near/location?longitude=${userLongitude}&latitude=${userLatitude}&maxdistance=${userMaxDistance}`)
      .expect(400)
      .end(done);

  });

})

describe("Add prayertimes for a mosque --/mosque/:id", ()=>{
  it("should add prayertimes for a mosque with no prayertimes",(done)=>{
    
    var mosqueId = mosques[8]._id;

    request(app)
      .patch(`/mosque/${mosqueId}/prayertimes`)
      .set("x-auth", users[0].tokens[0].token)
      .send({prayertimes: newPrayerTimes})
      .expect(200)
      .expect((res)=>{
      	expect(res.body.prayer_times[0].time).toExist();
      })
      .end((err)=>{
        if(err){
          return done(err);
        }
        Mosque.find({_id:mosqueId}).then((mosque)=>{
          expect(mosque[0].prayer_times[0].time).toExist();
          done();
        }).catch((err)=>done(err));
      });

  });

  it("should update prayertimes for a mosque",(done)=>{
    
    var mosqueId = mosques[7]._id;

    request(app)
      .patch(`/mosque/${mosqueId}/prayertimes`)
      .set("x-auth", users[0].tokens[0].token)
      .send({prayertimes: newPrayerTimes})
      .expect(200)
      .expect((res)=>{
      	expect(res.body.prayer_times[0].time).toNotBe(mosques[7].prayer_times[0].time);
      })
      .end((err)=>{
        if(err){
          return done(err);
        }
        Mosque.find({_id:mosqueId}).then((mosque)=>{
          expect(mosque[0].prayer_times[0].time).toNotBe(mosques[7].prayer_times[0].time);
          done();
        }).catch((err)=>done(err));
      });

  });

  it("should not add prayertimes for a mosque from an unauthorized user",(done)=>{
    
    var mosqueId = mosques[8]._id;

    request(app)
      .patch(`/mosque/${mosqueId}/prayertimes`)
      .send({prayertimes: newPrayerTimes})
      .expect(401) 
      .end(done);
  });

  it("should not add prayertimes for a mosque if prayertime is not provided",(done)=>{
    
    var mosqueId = mosques[8]._id;

    request(app)
      .patch(`/mosque/${mosqueId}/prayertimes`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(400) 
      .end(done);
  });

  it("should not add prayertimes for a mosque if mosque id is invalid",(done)=>{
    
    var mosqueId = "invalid1d";

    request(app)
      .patch(`/mosque/${mosqueId}/prayertimes`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404) 
      .end(done);
  });

})