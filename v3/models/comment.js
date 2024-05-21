// SCHME SETUP //
var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var CommentSchema = mongoose.Schema({
  text: String,
  author: String,
});

module.exports = mongoose.model("Comment", CommentSchema);
