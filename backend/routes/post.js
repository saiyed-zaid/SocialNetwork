const express = require("express");
const router = express.Router();
const postController = require("../controller/post");
const { body } = require("express-validator");
const jwt = require('jsonwebtoken');
const auth_check = require('../middleware/auth-check');

router.get("/api/post", postController.getPosts);

/* Checking Autherization */
router.use(auth_check);
/* Checking Autherization */

router.post(
  "/api/post",
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

module.exports = router;
