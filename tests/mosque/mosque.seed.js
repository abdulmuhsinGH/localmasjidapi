
const Mosque = require("../../api/model/mosque.model");


const populateMosques = (done)=>{

  Mosque.remove({}).then(()=>done());
}


module.exports = {populateMosques}