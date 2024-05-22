var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var passport = require("passport");
var localStrategy = require("passport-local");
var User = require("./models/user");

//CALLING THE SEED FUNCTION//
seedDB();

//PASSPORT CONFIGURTION//
app.use(
  require("express-session")({
    secret: "Once again rusty wins the cutest dog!",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

//connecting database here//
mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// ROOT ROUTE//
app.get("/", function (req, res) {
  res.render("landing");
});

// index route
app.get("/campgrounds", function (req, res) {
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

//==============================================================CAMPGROUND ROUTES================================================//

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
app.get("/campgrounds/new", isLoggedIn, function (req, res) {
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

//==============================================================================================================================//

//===========================================================COMMENTS ROUTES===================================================//

app.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
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

app.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
  var ID = req.params.id.trim();
  Campground.findById(ID)
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

//=================================================================================================================================//

//====================================================AUTHENTHICATION ROUTES=====================================================//

//Show the register form//
app.get("/register", function (req, res) {
  res.render("register");
});
// handle the sign up[ logic//
app.post("/register", function (req, res) {
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
app.get("/login", function (req, res) {
  res.render("login");
});
// handle the login logic//
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);
//logout logic//
app.get("/logout", function (req, res) {
  req.logout(function (req, res) {});
  res.redirect("/campgrounds");
});

//funciotn for checkig whaether the user is login or not//
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// TO START THE SERVER//
app.listen(5000, function () {
  console.log("The YelpCamp server has started");
});
