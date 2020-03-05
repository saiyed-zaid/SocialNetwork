const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 120
  },
  body: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 2000
  }
});

module.exports = mongoose.model("Post", PostSchema);
