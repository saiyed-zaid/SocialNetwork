const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const PostSchema = new Schema({
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
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
  },
  likes: [
    {
      user: {
        type: ObjectId,
        ref: "User",
      },
      isNewLike: {
        type: Boolean,
        default: true,
      },
      likedFrom: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  tags: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      text: String,
      created: {
        type: Date,
        default: Date.now,
      },
      isNewComment: {
        type: Boolean,
        default: true,
      },
      postedBy: {
        type: ObjectId,
        ref: "User",
      },
      hasReply: {
        type: Boolean,
        default: false,
      },
      replies: [
        {
          text: String,
          created: {
            type: Date,
            default: Date.now,
          },
          postedBy: {
            type: ObjectId,
            ref: "User",
          },
        },
      ],
    },
  ],
  status: {
    type: Boolean,
    default: true,
  },
  disabledBy: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Post", PostSchema);
