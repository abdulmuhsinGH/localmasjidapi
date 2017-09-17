const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var mongoosePromise = mongoose.connect(process.env.MONGODB_URI, {
  useMognoClient:true
});

mongoosePromise.then((db)=>{
  console.log(`Connected to ${process.env.MONGODB_URI}`);
})
.catch((err)=>{
  console.log(err)
})

module.exports = mongoose;
