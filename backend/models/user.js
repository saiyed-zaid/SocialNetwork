const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Add about field
const UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  about: {
    type: String,
    default: "-"
  },
  email: {
    type: String,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date
  },
  photo: {
    type: Object
  },
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  resetPasswordLink: {
    type: String,
    default: ""
  },
  role: {
    type: String,
    default: "subscriber"
  }
});

module.exports = mongoose.model("User", UserSchema);
