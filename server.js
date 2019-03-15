require('./config/config');

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

var mongoose = require("./db/db");
//models
var Mosque = require("./api/model/mosque.model");

const app = express();
const port = process.env.PORT;

//console.log("hello")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//routes
var index = require("./api/routes/index");
app.use("/api/v1", index);

const server = app.listen(port,()=>{
	console.log(`Listening on ${port}`);
});

module.exports = app;