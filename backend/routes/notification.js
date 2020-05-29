const express = require("express");
const router = express.Router();
const authCheck = require("../middleware/auth-check");
const User = require("../models/user");
const Post = require("../models/posts");
const Message = require("../models/messages");
var mongoose = require("mongoose");

router.get("/api/newFollowers/user/:userId", authCheck, (req, res, next) => {
  User.find(
    {
      _id: req.auth._id,
      "followers.isNewUser": true,
    },
    (err, result) => {
      if (err) {
        return next(new Error("User Not Found"));
      }
      if (result) {
        console.log("NEW FOLLOWE_", result[0].followers);

        return res.status(200).json(result[0].followers);
      }
    }
  )
    .populate({ path: "followers.user", select: "name" })
    .select("followers.followedFrom");
});

router.get(
  "/api/new/likeComments/post/by/:userId",
  authCheck,
  (req, res, next) => {
    Post.find(
      {
        $or: [
          {
            "likes.isNewLike": true,
          },
          {
            "comments.isNewComment": true,
          },
        ],
      },
      (err, result) => {
        if (err) {
          return res.json(err);
        }
        if (result) {
          return res.json(result);
        }
      }
    )
      .populate("likes.user", "name")
      .populate("comments.postedBy", "name")
      .select("_id likes comments");
  }
);

router.get("/api/messages/changesisNewMessage", authCheck, (req, res, next) => {
  Message.updateMany(
    {
      receiver: mongoose.Types.ObjectId(req.auth._id),
      sender: mongoose.Types.ObjectId(req.body.sender),
      isNewMessage: true,
    },
    {
      $set: {
        isNewMessage: false,
      },
    },
    (err, result) => {
      if (err) {
        res.status(400).json(err);
      }
      if (result) {
        res.status(200).json(result);
      }
    }
  );
});

module.exports = router;
