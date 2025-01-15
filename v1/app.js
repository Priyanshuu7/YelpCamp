Uiovar express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

var campgrounds = [
  {
    name: "Salmon",
    image:
      "https://safesearch.pixabay.com/get/ge183ae9a2a691233705a6a5075633788697ad95c50366a6fddf34d66f7874379570e200390ff69e53c29209b529caeb5_340.jpg",
  },
  {
    name: "daiys home",
    image:
      "https://safesearch.pixabay.com/get/ge183ae9a2a691233705a6a5075633788697ad95c50366a6fddf34d66f7874379570e200390ff69e53c29209b529caeb5_340.jpg",
  },
  {
    name: "Grek god",
    image:
      "https://safesearch.pixabay.com/get/g2a22b0ca5a4feb73c5c2c648df5e552932109e4afb416ec4613f08bb3e7aaccbdb93afab37219487e3be2a3969eed65f_340.jpg",
  },
];
//Root Route//
app.get("/", function (req, res) {
  res.render("landing");
});

app.get("/campgrounds", function (req, res) {
  res.render("campgrounds", { campgrounds: campgrounds });
});

app.post("/campgrounds", function (req, res) {
  //get data from the from and add to thhe array
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = { name: name, image: image };
  campgrounds.push(newCampground);
  //redirect to campground page//
  res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function (req, res) {
  res.render("new.ejs");
});

// To start the server//
app.listen(5000, function () {
  console.log("The YelpCamp server has started");
});
