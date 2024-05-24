//ALL THE MIDDLE WARE GOES HERE//
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id)
      .then((foundCampground) => {
        // does the user own thge campground//
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        }
      })
      .catch((err) => {
        req.flash("error", "Campground Not found");
        res.redirect("back");
      });
  } else {
    req.flash("error", "You dont have permisssion to that");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id).then((foundComment) => {
      // does the user own thge campground//
      if (foundComment.author.id.equals(req.user._id)) {
        next();
      } else {
        req.flash("error", "you dont have permission to do that");
        res.redirect("back");
      }
    });
  } else {
    req.flash("error", "you need to be logged to do that");
    res.redirect("/login");
  }
};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be Logged in to that");
  res.redirect("/login");
};
module.exports = middlewareObj;
