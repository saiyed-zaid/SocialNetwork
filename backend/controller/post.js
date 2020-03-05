const Post = require("../model/posts");
const { validationResult } = require("express-validator");
exports.getPosts = (req, res, next) => {
  res.json({
    posts: [
      {
        title: "first post #1",
        message: "This is my first post"
      }
    ]
  });
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
  const post = new Post(req.body);
  try {
    const result = await post.save();
    res.json(result);
  } catch (err) {
    console.log("Error while Creating Post", err);
  }
};
