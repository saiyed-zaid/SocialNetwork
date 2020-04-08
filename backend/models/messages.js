const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const MessageSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 120,
  },
  sender: {
    type: ObjectId,
    ref: "User",
  },
  receiver: {
    type: ObjectId,
    ref: "User",
  },
  created: {
    type: Date,
    default: Date.now,
  },
  isNewMessage: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Message", MessageSchema);
