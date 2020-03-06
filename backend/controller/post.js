const Post = require("../model/posts");
const { validationResult } = require("express-validator");
const _ = require("lodash");


exports.postById = async (req, res, next, id) => {
  try {
    const post = await Post.findOne({ _id: id });
    if (post) {
      req.post = post;
    }
  } catch (error) {
    console.log("Error while fatching post.", error);
  }
  next();
};

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().select("_id title body postedBy");
    res.json({ posts });
  } catch (error) {
    console.log("Error while fetching posts", error);
    res.status(422).json({ msg: "Error while fetching posts" });
  }
};

exports.getPostsByUser = async (req, res, next) => {
  try {
    const posts = await Post.find({ postedBy: req.profile._id });
    if (posts.length == 0) {
      return res.json({
        msg: "There is no posts by this user"
      });
    }
    return res.json({
      posts
    });
  } catch (error) {
    return res.json({
      msg: "Error while fetching Posts"
    });
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = errors.array()[0].msg;
    console.log("error handler__", err);
    return res.status(422).json({
      msg: err
    });
  }
  const post = new Post({
    title: req.body.title,
    body: req.body.body,
    postedBy: req.auth._id
  });
  try {
    const result = await post.save();
    res.json({ result });
  } catch (err) {
    console.log("Error while Creating Post", err);
  }
};

exports.deletePost =  async (req, res, next) => {
  const post = req.post;
  if (!post) {
    return res.json({ msg: "Post not Found" });
  }

  if (req.auth._id != req.post.postedBy) {
    return res.json({ msg: "Not authorized user for deleting this post." });
  }
  try {
    const result = await Post.remove({ _id: req.post._id });
    return res.json({ msg: "Post deleted successfully." });
  } catch (error) {
    return res.json({ msg: "Error while deleting post." });
  }
}

exports.updatePost = async (req, res, next) => {
  if (req.auth._id != req.post.postedBy) {
    return res.json({ msg: "Not authorized user for Updating this post." });
  }

  let post = req.post;
  post = _.extend(post, req.body);
  post.updated = Date.now();
  try {
    const result = await post.save();
    res.json({ post });
  } catch (error) {
    res.json({
      msg: "Error while updating profile"
    });
  }
};