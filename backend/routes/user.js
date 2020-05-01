const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth_check = require("../middleware/auth-check");
const _ = require("lodash");
const multer = require("multer");
const path = require("path");
const User = require("../models/user");
const Message = require("../models/messages");

/**
 * @function get
 * @description Handling get request which fetch messages
 * @param {middleware} Checking Authorization
 * @param {middleware} findPeople
 */
router.post("/api/user/messages", auth_check, (req, res, next) => {
  console.log("+___api invoked___+", req.body);
  Message.find({
    $or: [{ sender: req.body.sender }, { sender: req.body.receiver }],
    $and: [
      {
        $or: [{ receiver: req.body.sender }, { receiver: req.body.receiver }],
      },
    ],
  })
    .sort({ created: 1 })
    .then((result) => {
      console.log("FRESHED DATA__+", result);
      res.json(result);
      //io.emit(data.receiver, data);
    })
    .catch((err) => {
      if (err) {
        console.log("error while fetching messages", err);
      }
    });
});

/**
 * @function put
 * @description Handling put request which Update isNewUser status false
 * @param {middleware} Checking Authorization
 * @param {middleware} newFollowerStatusChagne
 */
router.put(
  "/api/user/newFollowerStatusChange/:userId",
  auth_check,
  userController.newFollowerStatusChagne
);

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
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join("upload", "users", req.auth._id, "profile"));
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb(
          new Error("File type is invalid, allowed types [jpeg, jpg]."),
          false
        );
      }
    },
  }).single("photo"),
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

router.get(
  "/api/user/getonline/:userId",
  auth_check,
  userController.getOnlinePeople
);

router.get(
  "/api/user/newusers/:userId",
  auth_check,
  userController.dailyNewUsers
);

router.get(
  "/api/user/onlinetoday/:userId",
  auth_check,
  userController.userOnlineToday
);
router.get(
  "/api/user/onlinenow/:userId",
  auth_check,
  userController.userOnlineNow
);

/**
 * @function router.param("userId", userController.userById);
 * @description Invoked callback function whenever userId appended in URL which fetch user data and stored in req object
 * @param {middleware} userById
 */
router.param("userId", userController.userById);

module.exports = router;
