const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const PostScheduleSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 120,
  },
  body: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 2000,
  },
  photo: {
    type: Array,
  },
  postedBy: {
    type: ObjectId,
    ref: "User",
  },
  tags: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  status: {
    type: Boolean,
    default: true,
  },
  scheduleTime: {
    type: Date,
  },
});

module.exports = mongoose.model("PostSchedule", PostScheduleSchema);
