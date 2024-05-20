var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const { name } = require("ejs");

mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// SCHME SETUP //
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
});
var Campground = mongoose.model("Campground", campgroundSchema);

// STATIC ADDING OF CAMPGROUND WE CAN ALL ADD NEW CAMPGROUND THROGH OUR CAMPGROUND FORM ON NEW CAMPGROUNDS PAGE WICH IS TYPED BELOW//

// Campground.create({
//   name: "Priyanshu Rajak",
//   image:
//     "https://t3.ftcdn.net/jpg/05/33/76/38/360_F_533763874_3JZruw5ZGXNrVS47ARY3oiEJ0ubrUvJC.jpg",
// })
//   .then((campground) => {
//     console.log("new campground added:", Campground);
//     console.log(campground);
//   })
//   .catch((error) => {
//     console.error("Something went wrong", error);
//   });

// ROOT ROUTE//
app.get("/", function (req, res) {
  res.render("landing");
});

app.get("/campgrounds", function (req, res) {
  Campground.find({})
    .then((foundItems) => {
      res.render("campgrounds", { campgrounds: foundItems });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/campgrounds", function (req, res) {
  //get data from the from and add to thhe array
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = { name: name, image: image };

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
// NEW CAMPFROUNDS PAGE//
app.get("/campgrounds/new", function (req, res) {
  res.render("new.ejs");
});

// TO START THE SERVER//
app.listen(5000, function () {
  console.log("The YelpCamp server has started");
});
