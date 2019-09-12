// Dependencies
const express = require("express");
const bodyParser = require("body-parser"); //JSON responses
const mongoose = require("mongoose"); //Mongo object modelling 
//const request = require("request"); //Makes http calls
const cheerio = require("cheerio"); //Scraper

// Require all models
const db = require("./model");

// Port configuration for local/Heroku
const PORT = process.env.PORT || process.argv[2] || 3000;

// Initialize Express
const app = express();

var favicon = require("serve-favicon");
console.log("favicon location: " + __dirname + "/favicon.ico");
app.use(favicon(__dirname + "/favicon.ico"));

// Parse request body as JSON
app.use(bodyParser.urlencoded({ extended: true }));

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Make public a static folder
app.use(express.static("public"));
const router = require("./controllers/api.js");
app.use(router);
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.listen(PORT, function () {
    console.log(`This application is running on port: ${PORT}`);
});
