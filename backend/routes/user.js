const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth_check = require("../middleware/auth-check");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const sendMail = require("../helper/mailer");
const _ = require("lodash");
const md5 = require("md5");

/**
 * @function put
 * @description Handling put request which Update user follow and add followers
 * @param {middleware} Checking Authorization
 * @param {middleware} updateUser
 */
router.put(
  "/api/user/follow/:userId",
  auth_check,
  userController.addFollowing,
  userController.addFollower
);

router.put(
  "/api/user/unfollow/:userId",
  auth_check,
  userController.removeFollowing,
  userController.removeFollower
);

/**
 * @function get
 * @description Handling get request which fetch all Users
 * @param {String} path of router
 * @param {middleware} property getUsers
 */
router.get("/api/users", userController.getUsers);

/**
 * @function get
 * @description Handling get request which fetch single User
 * @param {middleware} Checking Authorization
 * @param {middleware} getUser
 */
router.get("/api/user/:userId", auth_check, userController.getUser);

/**
 * @function put
 * @description Handling put request which Update single user
 * @param {middleware} Checking Authorization
 * @param {middleware} updateUser
 */
router.put(
  "/api/user/:userId",
  auth_check,
  userController.hasAuthorization,
  userController.updateUser
);

/**
 * @function delete
 * @description Handling delete request which delete single user
 * @param {middleware} Checking Authorization
 * @param {middleware} deleteUser
 */
router.delete(
  "/api/user/:userId",
  auth_check,
  userController.hasAuthorization,
  userController.deleteUser
);

/**
 * @function get
 * @description Handling get request which findpeople to follow
 * @param {middleware} Checking Authorization
 * @param {middleware} findPeople
 */
router.get(
  "/api/user/findpeople/:userId",
  auth_check,
  userController.findPeople
);

/**
 * @function router.param("userId", userController.userById);
 * @description Invoked callback function whenever userId appended in URL which fetch user data and stored in req object
 * @param {middleware} userById
 */
router.param("userId", userController.userById);

module.exports = router;
