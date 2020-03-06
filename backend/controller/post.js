const Post = require("../model/posts");
const { validationResult } = require("express-validator");
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().select("_id title body postedBy");
    res.json({ posts });
  } catch (error) {
    console.log("Error while fetching posts", error);
    res.status(422).json({ msg: "Error while fetching posts" });
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
