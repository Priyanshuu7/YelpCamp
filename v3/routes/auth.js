//====================================================AUTHENTHICATION ROUTES=====================================================//
// ROOT ROUTE//

var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function (req, res) {
  res.render("landing");
});

//Show the register form//
router.get("/register", function (req, res) {
  res.render("register");
});

// handle the sign up[ logic//
router.post("/register", function (req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      req.flash("error", err.message);
      // return res.render("register");
      res.redirect("back");
    }
    passport.authenticate("local")(req, res, function () {
      req.flash("success", "Welcome to yelp_camp " + user.username);
      res.redirect("/campgrounds");
    });
  });
});
//Show the login form//
router.get("/login", function (req, res) {
  res.render("login");
});

// handle the login logic//
// router.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/campgrounds",
//     failureRedirect: "/login",
//   })
// );
//THIS CODE IS FROM PERPLEXICITY
router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("error", info.message); // Set error flash message
      return res.redirect("/login");
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome back!"); // Set success flash message
      return res.redirect("/campgrounds");
    });
  })(req, res, next);
});

//logout logic//
router.get("/logout", function (req, res) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    // Other logout logic
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
  });
});

module.exports = router;
//=================================================================================================================================//
