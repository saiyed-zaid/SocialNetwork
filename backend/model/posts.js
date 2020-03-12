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
    type: ObjectId,
    ref: "User"
  },
  created:{
    type:Date,
    default:Date.now
  },
  updated:{
    type:Date
  },
  likes:[{
    type:ObjectId,
    ref:"User"
  }],
  comments:[{
    text:String,
    created:{
      type:Date,
      default: Date.now
    },
    postedBy:{
      type: ObjectId,
      ref: "User"
    }
  }]
});

module.exports = mongoose.model("Post", PostSchema);
