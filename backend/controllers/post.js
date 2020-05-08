const Post = require("../models/posts");
const fs = require("fs");
const { validationResult } = require("express-validator");
const _ = require("lodash");

/**
 * @function middleware
 * @description Handling get request which fetch all posts by postId
 */
exports.postById = async (req, res, next, id) => {
  try {
    const post = await Post.findOne({ _id: id })

      .populate("postedBy", "_id name role")
      .populate("likes", "_id ")
      .populate("comments.postedBy", "_id name photo")
      .select("comments title body photo created");

    if (post) {
      req.post = post;
    }
  } catch (error) {
    console.log("Error while fatching post.", error);
  }
  next();
};

/**
 * @function middleware
 * @description Handling get request which fetch single post by postId
 */
exports.getPost = async (req, res, next) => {
  return res.json(req.post);
};

/**
 * @function middleware
 * @description Handling get request which fetch all posts
 */
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ status: true })
      .populate("postedBy", "_id name photo")
      .populate("comments", "text created")
      .populate("comments.postedBy", "_id name")
      .select("_id title body created likes photo status")
      .sort({ created: -1 });
    res.json({ posts });
  } catch (error) {
    console.log("Error while fetching posts", error);
    res.status(422).json({ msg: "Error while fetching posts" });
  }
  4;
};

/**
 * @function middleware
 * @description Handling get request which fetch all posts FOR ADMIN
 */
exports.getPostsForAdmin = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("postedBy", "_id name")
      .populate("comments", "text created")
      .populate("comments.postedBy", "_id name")
      .select("_id title body created likes photo status")
      .sort({ created: -1 });
    res.json({ posts });
  } catch (error) {
    console.log("Error while fetching posts", error);
    res.status(422).json({ msg: "Error while fetching posts" });
  }
};

/**
 * @function middleware
 * @description Handling get request which fetch all posts by userId
 */
exports.getPostsByUser = async (req, res, next) => {
  try {
    const posts = await Post.find({
      $or: [
        {
          $and: [
            { postedBy: req.profile._id },
            { disabledBy: String(req.profile._id) },
            { status: false },
          ],
        },
        {
          $and: [
            { postedBy: req.profile._id },
            {
              disabledBy: "",
            },
            {
              status: true,
            },
          ],
        },
      ],
    })
      .populate("postedBy", "_id name role")
      .select("_id title body created likes status photo")
      .sort("_created");
    if (posts.length == 0) {
      return res.json({
        msg: "There is no posts by this user",
        posts: [],
      });
    }
    return res.json({
      posts,
    });
  } catch (error) {
    return res.json({
      msg: "Error while fetching Posts",
    });
  }
};

exports.hasAuthorization = (req, res, next) => {
  if (req.auth.role != "admin" && req.auth.role != "subscriber") {
    return res.json({
      msg: "Not authorized user for this action on the post.",
    });
  }
  if (req.auth.role == "admin") {
    return next();
  }

  if (req.auth._id != req.post.postedBy._id) {
    return res.json({
      msg: "Not authorized user for this action on the post.",
    });
  }
  next();
};

/**
 * @function middleware
 * @description Handling post request which create new post in database
 */
exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);

  const reqFiles = [];

  const url = req.protocol + "://" + req.get("host");
  for (var i = 0; i < req.files.length; i++) {
    reqFiles.push(url + "/upload/" + req.files[i].filename);
  }

  /* if (!errors.isEmpty()) {
    const err = errors.array()[0].msg;
    return res.status(422).json({
      errors: err,
    });
  } */

  if (!errors.isEmpty()) {
    const allErrors = errors.array();
    return res.status(422).json({
      errors: allErrors,
    });
  }

  const post = new Post({
    title: req.body.title,
    body: req.body.body,
    postedBy: req.auth._id,
    photo: reqFiles,
  });

  try {
    const result = await post.save();

    res.json({ result });
  } catch (err) {
    console.log("Error while Creating Post", err);
  }
};

/**
 * @function middleware
 * @description Handling delete request which delete post in database
 */
exports.deletePost = async (req, res, next) => {
  const post = req.post;
  if (!post) {
    return res.json({ msg: "Post not Found" });
  }
  //console.table(req.auth.role);
  if (
    req.auth._id != req.post.postedBy._id &&
    req.auth.role != "subscriber" &&
    req.auth.role != "admin"
  ) {
    return res(401).json({
      msg: "Not authorized user for deleting this post.",
    });
  }
  try {
    const result = await Post.remove({ _id: req.post._id });
    return res.json({ msg: "Post deleted successfully." });
  } catch (error) {
    return res.json({ msg: "Error while deleting post." });
  }
};

/**
 * @function middleware
 * @description Handling patch request which update post in database
 */
exports.updatePost = async (req, res, next) => {
  let post = req.post;

  const prevPostPhoto = post.photo;
  if (!req.file) {
    req.file = post.photo;
  }
  post.photo = req.file;
  post = _.extend(post, req.body);
  post.updated = Date.now();
  try {
    const result = await post.save();
    //prevPostPhoto
    if (result) {
      if (prevPostPhoto) {
        fs.unlink(prevPostPhoto.path, (err) => {
          console.log("Error while unlink user image", err);
        });
      }
    }
    res.json({ post });
  } catch (error) {
    res.json({
      msg: "Error while updating profile " + error,
    });
  }
};

/**
 * @function middleware
 * @description Handling patch request which update post like in database
 */
exports.likePost = async (req, res, next) => {
  //console.log("uiserID__", req.body);

  try {
    const UpdatedLikePost = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.body.userId },
      },
      { new: true }
    );
    res.json(UpdatedLikePost);
  } catch (error) {
    res.status(400).json(error);
  }
};

/**
 * @function middleware
 * @description Handling patch request which update post unlike in database
 */
exports.unlikePost = async (req, res, next) => {
  try {
    const UpdatedLikePost = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.body.userId },
      },
      { new: true }
    );
    res.json(UpdatedLikePost);
  } catch (error) {
    res.status(400).json(error);
  }
};

/**
 * @function middleware
 * @description Handling patch request which update/Add post Comment in database
 */
exports.commentPost = async (req, res, next) => {
  try {
    let comment = req.body.comment;
    comment.postedBy = req.body.userId;

    const UpdatedCommentPost = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { comments: comment },
      },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name");
    res.json(UpdatedCommentPost);
  } catch (error) {
    res.status(400).json(error);
  }
};

/**
 * @function middleware
 * @description Handling patch request which update post Uncomment in database
 */
exports.uncommentPost = async (req, res, next) => {
  try {
    let comment = req.body.comment;

    const UpdatedCommentPost = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { comments: { _id: comment._id } },
      },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name");
    res.json(UpdatedCommentPost);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.dailyNewPosts = async (req, res, next) => {
  let created = req.profile.created.toDateString();
  let startDate = new Date();
  console.log(req);

  try {
    const posts = await Post.find({
      created: { $gte: startDate.toDateString() },
    });

    return await res.json(posts);
  } catch (error) {
    res.status(400).json({ err: error });
  }
};
