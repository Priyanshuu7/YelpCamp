var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var seedDB = require("./seeds");

seedDB();
//connecting database here//
mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// ROOT ROUTE//
app.get("/", function (req, res) {
  res.render("landing");
});

// index route
app.get("/campgrounds", function (req, res) {
  Campground.find({})
    .then((foundItems) => {
      res.render("index", { campgrounds: foundItems });
    })
    .catch((err) => {
      console.log(err);
    });
});

//add new campground route
app.post("/campgrounds", function (req, res) {
  //get data from the from and add to thhe array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;

  var newCampground = { name: name, image: image, description: desc };

  // CREATE A NEW CAMPGROUND AND ADD TO DATABASE//
  Campground.create(newCampground)
    .then((result) => {
      // RIDECT TO ALLCAMPGROUNDS PAGE//
      res.redirect("/campgrounds");
      console.log(result);
    })
    .catch((error) => {
      console.log("something went wrong", error);
    });
});
// showing form route //
app.get("/campgrounds/new", function (req, res) {
  res.render("new.ejs");
});

//show more about description//
app.get("/campgrounds/:id", function (req, res) {
  Campground.findById(req.params.id)
    .populate("comments")
    .then((foundCampground) => {
      // render show templates//
      res.render("show", { campground: foundCampground });
      console.log(foundCampground);
    })
    .catch((err) => {
      console.log(err);
    });
});

// TO START THE SERVER//
app.listen(5000, function () {
  console.log("The YelpCamp server has started");
});
