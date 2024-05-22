//===========================================================COMMENTS ROUTES===================================================//
var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");

//New commets//
router.get("/new", isLoggedIn, function (req, res) {
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

//create commets//
router.post("/", isLoggedIn, function (req, res) {
  var ID = req.params.id.trim();
  Campground.findById(ID)
    .then((campground) => {
      Comment.create(req.body.comment)
        .then((comment) => {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
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
//middleware//
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
module.exports = router;
//=================================================================================================================================//
