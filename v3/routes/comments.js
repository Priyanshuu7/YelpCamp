//===========================================================COMMENTS ROUTES===================================================//
var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
const comment = require("../models/comment");
var middleware = require("../middleware/index.js");

//New commets//
router.get("/new", middleware.isLoggedIn, function (req, res) {
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
router.post("/", middleware.isLoggedIn, function (req, res) {
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
          req.flash("success", "SuccessFully added comment");
          res.redirect("/campgrounds/" + campground._id);
        })
        .catch((error) => {
          req.flash("error", "something went wrong");
          console.log(error);
        });
    })
    .catch((error) => {
      res.redirect("/campgrounds");
    });
});

//edit routes for commet//
router.get(
  "/:comment_id/edit",
  middleware.checkCommentOwnership,
  function (req, res) {
    Comment.findById(req.params.comment_id)
      .then((foundComment) => {
        res.render("comments/edit", {
          campground_id: req.params.id,
          comment: foundComment,
        });
      })
      .catch((error) => {
        res.redirect("back");
      });
  }
);

// updating  route the commments//
router.put(
  "/:comment_id",
  middleware.checkCommentOwnership,
  function (req, res) {
    var ID1 = req.params.comment_id.trim();
    Comment.findByIdAndUpdate(ID1, req.body.comment)
      .then((updatedComment) => {
        res.redirect("/campgrounds/" + req.params.id.trim());
      })
      .catch((error) => {
        res.redirect("back");
      });
  }
);

//Delete route or comment//
router.delete(
  "/:comment_id",
  middleware.checkCommentOwnership,
  function (req, res) {
    Comment.findByIdAndDelete(req.params.comment_id)
      .then(() => {
        req.flash("success", " Comment deleted");
        res.redirect("/campgrounds/" + req.params.id);
      })
      .catch((error) => {
        res.redirect("back");
      });
  }
);

module.exports = router;
//=================================================================================================================================//
