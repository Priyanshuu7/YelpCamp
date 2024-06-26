//==============================================================CAMPGROUND ROUTES================================================//
var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware/index");
// index route
router.get("/", function (req, res) {
  Campground.find({})
    .then((foundItems) => {
      res.render("campgrounds/index", {
        campgrounds: foundItems,
        currentUser: req.user,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

//add new campground route
router.post("/", middleware.isLoggedIn, function (req, res) {
  //get data from the from and add to thhe array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    username: req.user.username,
    id: req.user._id,
  };

  var newCampground = {
    name: name,
    image: image,
    description: desc,
    author: author,
  };
  console.log(req.user);

  // CREATE A NEW CAMPGROUND AND ADD TO DATABASE//
  Campground.create(newCampground)
    .then((result) => {
      // RIDECT TO ALLCAMPGROUNDS PAGE//
      console.log(result);
      res.redirect("/campgrounds");
    })
    .catch((error) => {
      console.log("something went wrong", error);
    });
});
// showing form route //
router.get("/new", middleware.isLoggedIn, function (req, res) {
  res.render("campgrounds/new");
});

//show more about description//
router.get("/:id", function (req, res) {
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

//EDIT  CAMPGROUND//
router.get(
  "/:id/edit",
  middleware.checkCampgroundOwnership,
  function (req, res) {
    Campground.findById(req.params.id).then((foundCampground) => {
      res.render("campgrounds/edit", { campground: foundCampground });
    });
  }
);
//UPDATE CAMPGROUND//
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground)
    .then((updatedCampground) => {
      res.redirect("/campgrounds/" + req.params.id);
    })
    .catch((error) => {
      res.redirect("/campgrounds");
    });
});

//DELETE CAMPGROUNDS//
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect("/campgrounds");
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/campgrounds");
    });
});

module.exports = router;

//=================================================================================================================================//
