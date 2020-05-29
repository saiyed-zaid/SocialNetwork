const express = require("express");
const router = express.Router();
const postController = require("../controllers/post");
const userController = require("../controllers/user");
const { body } = require("express-validator");
const auth_check = require("../middleware/auth-check");
var multer = require("multer");
const path = require("path");
const Post = require("../models/posts");
const PostSchedule = require("../models/postSchedules");

/**
 * @function get
 * @description Handling get request which fetch single post
 * @param {String} path of router
 * @param {property} property getPost
 */
router.get("/api/post/:postId", postController.getPost);

/**
 * @function get
 * @description Handling get request which fetch all posts
 * @param {String} path of router
 * @param {property} property getPosts
 */
router.get("/api/posts", postController.getPosts);

/**
 * @function get
 * @description Handling get request which fetch all posts FOR ADMIN
 * @param {String} path of router
 * @param {property} property getPosts
 */
router.get(
  "/api/admin/posts",
  auth_check,
  (req, res, next) => {
    if (req.auth.role != "admin") {
      return res.json("Route access DENIED.");
    }
    next();
  },
  postController.getPostsForAdmin
);

/**
 * @function get
 * @description Handling get request which fetch all posts by userId
 * @param {String} path of router
 * @param {property} property getPostsByUser
 */
router.get("/api/post/by/:userId", auth_check, postController.getPostsByUser);

/**
 * @function get
 * @description Handling get request which fetch all Scheduled posts by userId
 * @param {String} path of router
 * @param {property} property getPostsByUser
 */
router.get(
  "/api/post/schedule/by/:userId",
  auth_check,
  postController.getScheduledPost
);

router.get("/api/post/schedule/edit/:postId", postController.getPost);

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
  multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
    },
    fileFilter: (req, file, cb) => {
      console.log("_Photot", req.file);

      if (
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype == "video/mp4"
      ) {
        cb(null, true);
      } else {
        cb(
          new Error("File type is invalid, allowed types [jpeg, jpg ,mp4]."),
          false
        );
      }
    },
  }).array("photo"),
  [
    body("title").notEmpty().withMessage("Title field is required."),
    body("title")
      .isLength({ min: 5, max: 120 })
      .withMessage("Title length must between 5 to 120."),
    body("body").notEmpty().withMessage("Body field is required."),
    body("body")
      .isLength({ min: 10, max: 2000 })
      .withMessage("Body length must between 5 to 2000."),
  ],
  postController.createPostSchedule,
  postController.createPost
);

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
 * @description Handling patch request which update/Add post Comment Reply in database
 * @param {String} path of router
 * @param {router} auth_check for checking authorization
 * @param {property} property reply commentPost
 */
router.patch(
  "/api/post/comment/reply",
  auth_check,
  postController.commentPostReply
);
/**
 * @function patch
 * @description Handling patch request which update post Uncomment in database
 * @param {String} path of router
 * @param {router} auth_check for checking authorization
 * @param {property} property uncommentPost
 */
router.patch("/api/post/uncomment", auth_check, postController.uncommentPost);
/**
 * @function delete
 * @description Handling delete request which delete post in database
 * @param {String} path of router
 * @param {router} auth_check for checking authorization
 * @param {property} property deletePost
 */
router.delete(
  "/api/post/:postId",
  auth_check,
  postController.hasAuthorization,
  postController.deletePost
);

/**
 * @function patch
 * @description Handling patch request which Add comment reply  in post database
 * @param {String} path of router
 * @param {router} auth_check for checking authorization
 * @param {property} property commentreply
 */
router.patch(
  "/api/post/comment/reply",
  auth_check,
  postController.commentPostReply
);

/**
 * @function patch
 * @description Handling patch request which update post in database
 * @param {String} path of router
 * @param {router} auth_check for checking authorization
 * @param {property} property updatePost
 */
router.patch(
  "/api/post/:postId",
  auth_check,
  postController.hasAuthorization,
  multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
    },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype == "video/mp4"
      ) {
        cb(null, true);
      } else {
        cb(
          new Error("File type is invalid, allowed types [jpeg, jpg]."),
          false
        );
      }
    },
  }).array("photo"),
  postController.updatePost
);

/**
 * @function patch
 * @description Handling patch request which update schedule post in database
 * @param {String} path of router
 * @param {router} auth_check for checking authorization
 * @param {property} property update Schedule Post
 */
router.patch(
  "/api/post/schedule/:postId",
  auth_check,
  postController.hasAuthorization,
  multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
    },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype == "video/mp4"
      ) {
        cb(null, true);
      } else {
        cb(
          new Error("File type is invalid, allowed types [jpeg, jpg]."),
          false
        );
      }
    },
  }).array("photo"),
  postController.updateSchedulePost
);

router.get(
  "/api/post/newpost/:userId",
  auth_check,
  postController.dailyNewPosts
);

/**
 * @function put
 * @description Handling put request which Update isNewLike status false
 * @param {middleware} Checking Authorization
 * @param {middleware} newLikesStatusChange
 */
router.put(
  "/api/post/newLikesStatusChange/:postId",
  auth_check,
  userController.newFollowerStatusChagne
);

/**
 * @function delete
 * @description Handling delete request which delete schedule post in database
 * @param {String} path of router
 * @param {router} auth_check for checking authorization
 * @param {property} property deletePost
 */
router.delete(
  "/api/post/schedule/:postId",
  auth_check,
  postController.hasAuthorization,
  postController.deleteScheduledPost
);

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
