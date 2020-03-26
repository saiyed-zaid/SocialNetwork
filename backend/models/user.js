const mongoose = require("mongoose");
const Schema = mongoose.Schema;
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
      user: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      isNewUser: {
        type: Boolean,
        required: true,
        default: true
      },
      followedFrom: {
        type: Date,
        default: Date.now
      }
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
