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
 * @route    GET /api/post/:postId
 * @description Fetch post by its id
 * @access PUBLIC
 */
router.get("/api/post/:postId", postController.getPost);

/**
 * @route    GET /api/posts
 * @description Fetch posts
 * @access PUBLIC
 */
router.get("/api/posts", postController.getPosts);

/**
 * @route    GET /api/admin/posts
 * @description Fetch post for admin
 * @access PRIVATE
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
 * @description Handling get request which fetch all Scheduled  posts FOR ADMIN
 * @param {String} path of router
 * @param {property} property getPosts
 */
router.get(
  "/api/admin/scheduledposts",
  auth_check,
  (req, res, next) => {
    if (req.auth.role != "admin") {
      return res.json("Route access DENIED.");
    }
    next();
  },
  postController.getScheduledPostsForAdmin
);

/**
 * @route    GET /api/post/by/:userId
 * @description Fetch user posts
 * @access PRIVATE
 */
router.get("/api/post/by/:userId", auth_check, postController.getPostsByUser);

/**
 * @route    GET /api/post/schedule/by/:userId
 * @description Fetch schedule post of user
 * @access PRIVATE
 */
router.get(
  "/api/post/schedule/by/:userId",
  auth_check,
  postController.getScheduledPost
);

/**
 * @route    GET /api/user/newLikesStatusChange/:userId
 * @description New likes flag change
 * @access PRIVAte
 */
/* router.put(
  "/api/user/newLikesStatusChange/:userId",
  auth_check,
  postController.newLikesStatusChange
); */
router.get("/api/post/schedule/edit/:postId", postController.getPost);

/**
 * @route    POST /api/post/:userId
 * @description Add new post
 * @access PRIVATE
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
 * @route    PATCH /api/post/like
 * @description Add like on post
 * @access PRIVATE
 */
router.patch("/api/post/like", auth_check, postController.likePost);

/**
 * @route    PATCH /api/post/unlike
 * @description Remove like from post
 * @access PRIVATE
 */
router.patch("/api/post/unlike", auth_check, postController.unlikePost);

/**
 * @route    PATCH /api/post/comment
 * @description Add commenct on post
 * @access PRIVATE
 */
router.patch("/api/post/comment", auth_check, postController.commentPost);

/**
 * @route    PATCH /api/post/comment/reply
 * @description Add reply on post comment
 * @access PRIVATE
 */
router.patch(
  "/api/post/comment/reply",
  auth_check,
  postController.commentPostReply
);

/**
 * @route    PATCH /api/post/uncomment
 * @description Remove comment on post
 * @access PRIVATE
 */
router.patch("/api/post/uncomment", auth_check, postController.uncommentPost);

/**
 * @route    DELETE /api/post/:postId
 * @description Delete post
 * @access PRIVATE
 */
router.delete(
  "/api/post/:postId",
  auth_check,
  postController.hasAuthorization,
  postController.deletePost
);

/**
 * @route    PATCH /api/post/comment/reply
 * @description Add reply on comment
 * @access PRIVATE
 */
router.patch(
  "/api/post/comment/reply",
  auth_check,
  postController.commentPostReply
);

/**
 * @route    PATCH /api/post/:postId
 * @description Edit Post
 * @access PRIVATE
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
 * @route    PATCH /api/post/schedule/:postId
 * @description Edit schedule post
 * @access PRIVATE
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

/**
 * @route    GET /api/post/newpost/:userId
 * @description Fetch today new posts
 * @access PRIVATE
 */
router.get(
  "/api/post/newpost/:userId",
  auth_check,
  postController.dailyNewPosts
);

/**
 * @route    PUT /api/user/newLikesStatusChange/:userId
 * @description Change newLike Status
 * @access PRIVATE
 */
router.put(
  "/api/user/newLikesStatusChange/:userId",
  auth_check,
  postController.newLikesStatusChange
);

/**
 * @route    PUT /api/user/newCommentStatusChange/:userId
 * @description Change newComment status
 * @access PRIVATE
 */
router.put(
  "/api/user/newCommentStatusChange/:userId",
  auth_check,
  postController.newCommentStatusChange
);

/**
 * @route    DELETE /api/post/schedule/:postId
 * @description Delete schedule post
 * @access PRIVATE
 */
router.delete(
  "/api/post/schedule/:postId",
  auth_check,
  postController.hasAuthorization,
  postController.deleteScheduledPost
);

/**
 * @route    PARAM /:userId
 * @description Store useer in req object
 * @access PUBLIC
 */
router.param("userId", userController.userById);

/**
 * @route    GET /:postId
 * @description Store post in request object
 * @access PUBLIC
 */
router.param("postId", postController.postById);

module.exports = router;
