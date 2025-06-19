const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  author: String,
  content: String,
  image: String
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
