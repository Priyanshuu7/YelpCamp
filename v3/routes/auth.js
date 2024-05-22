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
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/campgrounds");
    });
  });
});
//Show the login form//
router.get("/login", function (req, res) {
  res.render("login");
});
// handle the login logic//
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);
//logout logic//
router.get("/logout", function (req, res) {
  req.logout(function (req, res) {});
  res.redirect("/campgrounds");
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
