// SCHME SETUP //
var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var CommentSchema = mongoose.Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
