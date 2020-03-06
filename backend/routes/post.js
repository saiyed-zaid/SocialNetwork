const express = require("express");
const router = express.Router();
const postController = require("../controller/post");
const userController = require("../controller/user");
const Post = require("../model/posts");
const { body } = require("express-validator");
const auth_check = require("../middleware/auth-check");

router.get("/api/post", auth_check, postController.getPosts);
router.get("/api/post/by/:userId", auth_check, postController.getPostsByUser);

router.post(
  "/api/post",
  auth_check,
  [
    body("title")
      .notEmpty()
      .withMessage("Title field is required."),
    body("title")
      .isLength({ min: 5, max: 120 })
      .withMessage("Title length must between 5 to 120."),
    body("body")
      .notEmpty()
      .withMessage("Title field is required."),
    body("body")
      .isLength({ min: 5, max: 2000 })
      .withMessage("Body length must between 5 to 2000.")
  ],
  postController.createPost
);

router.delete("/api/post/:postId", auth_check, postController.deletePost);
router.patch("/api/post/:postId", auth_check, postController.updatePost);

router.param("userId", userController.userById);

router.param("postId", postController.postById);

module.exports = router;
