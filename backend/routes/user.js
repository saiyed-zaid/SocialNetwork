const express = require("express");
const router = express.Router();
const userController = require("../controller/user");
const auth_check = require("../middleware/auth-check");

/**
 * @function put
 * @description Handling put request which Update user follow and add followers
 * @param {middleware} Checking Authorization
 * @param {middleware} updateUser
 */
router.put("/api/user", auth_check, userController.addFollowing,userController.addFollower);

router.put("/api/user", auth_check, userController.removeFollowing,userController.removeFollower);

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
router.put("/api/user/:userId", auth_check, userController.updateUser);

/**
 * @function delete
 * @description Handling delete request which delete single user
 * @param {middleware} Checking Authorization
 * @param {middleware} deleteUser
 */
router.delete("/api/user/:userId", auth_check, userController.deleteUser);

/**
 * @function router.param("userId", userController.userById);

 * @description Invoked callback function whenever userId appended in URL which fetch user data and stored in req object
 * @param {middleware} userById 
 */
router.param("userId", userController.userById);

module.exports = router;
