const express = require("express");
const router = express.Router();
const postController = require("../controller/post");
const userController = require("../controller/user");
const Post = require("../model/posts");
const { body } = require("express-validator");
const auth_check = require("../middleware/auth-check");

/**
 * @function get
 * @description Handling get request which fetch single post
 * @param {String} path of router
 * @param {property} property getPost
 */
router.get("/api/post/:postId", auth_check, postController.getPost);

/**
 * @function get
 * @description Handling get request which fetch all posts
 * @param {String} path of router
 * @param {property} property getPosts
 */
router.get("/api/posts", postController.getPosts);

/**
 * @function get
 * @description Handling get request which fetch all posts by userId
 * @param {String} path of router
 * @param {property} property getPostsByUser
 */
router.get("/api/post/by/:userId", auth_check, postController.getPostsByUser);

/**
 * @function post
 * @description Handling post request which create new post in database
 * @param {String} path of router
 * @param {router} auth_check for checking authorization
 * @param {array} validation
 * @param {property} property createPost
 */
router.post(
  "/api/post/:userId",
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

/**
 * @function delete
 * @description Handling delete request which delete post in database
 * @param {String} path of router
 * @param {router} auth_check for checking authorization
 * @param {property} property deletePost
 */
router.delete("/api/post/:postId", auth_check, postController.deletePost);

/**
 * @function patch
 * @description Handling patch request which update post in database
 * @param {String} path of router
 * @param {router} auth_check for checking authorization
 * @param {property} property updatePost
 */
router.patch("/api/post/:postId", auth_check, postController.updatePost);

/**
 * @function patch
 * @description Handling patch request which update post Like status in database
 * @param {String} path of router
 * @param {router} auth_check for checking authorization
 * @param {property} property likePost
 */
router.patch("/api/post/like", auth_check, postController.likePost);

/**
 * @function patch
 * @description Handling patch request which update post Unlike status in database
 * @param {String} path of router
 * @param {router} auth_check for checking authorization
 * @param {property} property unlikePost
 */
router.patch("/api/post/unlike", auth_check, postController.unlikePost);

/**
 * @function patch
 * @description Handling patch request which update/Add post Comment in database
 * @param {String} path of router
 * @param {router} auth_check for checking authorization
 * @param {property} property commentPost
 */
router.patch("/api/post/comment", auth_check, postController.commentPost);

/**
 * @function patch
 * @description Handling patch request which update post Uncomment in database
 * @param {String} path of router
 * @param {router} auth_check for checking authorization
 * @param {property} property uncommentPost
 */
router.patch("/api/post/uncomment", auth_check, postController.uncommentPost);

/**
 * @function param
 * @description Invoked a callback function whenever userId appended in URL
 * @param {String} userId
 * @param {property} property userById
 */
router.param("userId", userController.userById);

/**
 * @function param
 * @description Invoked a callback function whenever postId appended in URL
 * @param {String} userId
 * @param {property} property postById
 */
router.param("postId", postController.postById);

module.exports = router;
