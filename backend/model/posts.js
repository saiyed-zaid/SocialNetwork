const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

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
  },
  photo: {
    type: String
  },
  postedBy: {
    type: ObjectId
  },
  created:{
    type:Date,
    default:Date.now
  },
  updated:{
    type:Date
  }
});

module.exports = mongoose.model("Post", PostSchema);
