module.exports.findMosquesOnGoolgleMaps = async function(longitude, latitude){
    var key = process.env.GOOGLE_API_KEY;
    var location = `${latitude},${longitude}`;
    var radius = 2000;
    var types = "mosque";
  
    var axios = require('axios');
    var url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${key}&location=${location}&radius=${radius}&types=${types}`;
      console.log(url);
    try{
        const response = await axios.get(url);
        //console.log(response.data)
        return Promise.resolve(response.data.results)
        
    }catch(err){
        console.log(err)
        return Promise.reject(err)
    }
    
};