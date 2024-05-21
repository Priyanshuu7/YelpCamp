var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comment");
var data = [
  {
    name: "Cloud rest",
    image:
      "https://www.nps.gov/mora/planyourvisit/images/OhanaCampground2016_CMeleedy_01_web.jpeg?maxwidth=1300&maxheight=1300&autorotate=false",
    description: "blah blah blah",
  },
  {
    name: "rohan next ",
    image:
      "https://www.nps.gov/mora/planyourvisit/images/OhanaCampground2016_CMeleedy_01_web.jpeg?maxwidth=1300&maxheight=1300&autorotate=false",
    description: "blah blah blah",
  },
  {
    name: "descpacito rest",
    image:
      "https://www.nps.gov/mora/planyourvisit/images/OhanaCampground2016_CMeleedy_01_web.jpeg?maxwidth=1300&maxheight=1300&autorotate=false",
    description: "blah blah blah",
  },
  {
    name: "Cloud rest",
    image:
      "https://www.nps.gov/mora/planyourvisit/images/OhanaCampground2016_CMeleedy_01_web.jpeg?maxwidth=1300&maxheight=1300&autorotate=false",
    description: "blah blah blah",
  },
];

function seedDB() {
  //remove all campgrounds//
  Campground.deleteMany()
    .then(function () {
      console.log("Removed Campgrounds");
      // add campgrounds//
      data.forEach(function (seed) {
        Campground.create(seed)
          .then((campground) => {
            console.log("added campgrounds");
            //create comments for campgrounds//
            Comment.create({
              text: "This is a very good place but i wish that it maudsh have internet",
              author: "Hommer",
            })
              .then((comment) => {
                campground.comments.push(comment);
                campground.save();
                console.log("created new comments");
              })
              .catch((error) => {
                console.log("something went wrong", error);
              });
          })
          .catch((error) => {
            console.log("something went wrong", error);
          });
      });
    })
    .catch(function (err) {
      console.log(err);
    });
}
module.exports = seedDB;
