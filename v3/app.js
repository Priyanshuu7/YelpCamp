var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var seedDB = require("./seeds");
var Comment = require("./models/comment");

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
      res.render("campgrounds/index", { campgrounds: foundItems });
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
  res.render("campgrounds/new");
});

//show more about description//
app.get("/campgrounds/:id", function (req, res) {
  Campground.findById(req.params.id)
    .populate("comments")
    .then((foundCampground) => {
      // render show templates//
      res.render("campgrounds/show", { campground: foundCampground });
      console.log(foundCampground);
    })
    .catch((err) => {
      console.log(err);
    });
});

//=====================================COMMENTS ROUTES=============================//
app.get("/campgrounds/:id/comments/new", function (req, res) {
  //find new campground by id //
  Campground.findById(req.params.id.trim())
    .then((campgrounds) => {
      // render new comment from templates//
      res.render("comments/new", { campground: campgrounds });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/campgrounds/:id/comments", function (req, res) {
  Campground.findById(req.params.id.trim())
    .then((campground) => {
      Comment.create(req.body.comment)
        .then((comment) => {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log("Something went wrong", error);
      res.redirect("/campgrounds");
    });
});

//=================================================================================//

// TO START THE SERVER//
app.listen(5000, function () {
  console.log("The YelpCamp server has started");
});
