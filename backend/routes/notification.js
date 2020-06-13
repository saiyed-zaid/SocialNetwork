const express = require("express");
const router = express.Router();
const authCheck = require("../middleware/auth-check");
const User = require("../models/user");
const Post = require("../models/posts");
const Message = require("../models/messages");
var mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

/**
  * @route    GET /api/newFollowers/user/:userId
  * @description Fetch new followers
  * @access PRIVATE
 */
router.get("/api/newFollowers/user/:userId", authCheck, (req, res, next) => {
  User.find({ _id: new ObjectId(req.auth._id) }, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result[0]) {
      var newFollowers;
      newFollowers = result[0].followers.filter((newFollower) => {
        return newFollower.isNewUser === true && newFollower.user;
      });

      return res.status(200).json(newFollowers);
    }
  })
    .populate("followers.user", "name")
    .select("followers");
});

/**
  * @route    GET /api/new/likeComments/post/by/:userId
  * @description Fetch new Likes, Comments
  * @access PRIVATE
 */
router.get(
  "/api/new/likeComments/post/by/:userId",
  authCheck,
  async (req, res, next) => {
    const posts = await Post.find({
      postedBy: req.auth._id,
    })
      .populate("likes.user", "name")
      .populate("comments.postedBy", "name")
      .select("_id likes comments");

    let newLikes = [],
      newComments = [],
      filteredPosts = [];

    posts.forEach((post) => {
      newLikes = post.likes.filter((like) => {
        return like.isNewLike === true;
      });

      newComments = post.comments.filter((comment) => {
        return comment.isNewComment === true;
      });

      filteredPosts.push({
        postId: post._id,
        newLikes,
        newComments,
      });
    });

    return res.status(200).json(filteredPosts);
  }
);

/**
  * @route    GET /api/messages/changesisNewMessage
  * @description Change New Message Flag
  * @access PRIVATE
 */
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
        res.status(500).json({ error: " Something went wrong..." });
      }
      if (result) {
        res.status(200).json(result);
      }
    }
  );
});

module.exports = router;
