// required dependencies
var express = require("express");
var expressHandlebars = require("express-handlebars");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

// Set up the port to be either the host's designated port, or 3000
var PORT = process.env.PORT || 3000;

// Instantiate the Express App
var app = express();

// Set up an Express Router
var router = express.Router();

// Require routes file to pass the router object
require("./config/routes")(router);

// connect Handlebars to the Express app
app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));

// Designate the public folder as a static directory
app.use(express.static(__dirname + "/public"));

// Have every request go through the router middleware
app.use(router);

// If deployed, use the deployed database.  Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines2";

// Connect mongoose to the Mongo database
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).catch(error => { console.log(error) });
//mongoose.connect(db);

// the below connection also works
// mongoose.connect(db, function (error) {
//     console.log("inside of mongoose connect");
//     //Log any errors connecting with mongoose
//     if (error) {
//         console.log(error);
//     }
//     else {
//         console.log("mongoose connection is successful");
//     }
// })

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
