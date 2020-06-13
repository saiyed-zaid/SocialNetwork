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
 * @route    POST /api/user/messages
 * @description Fetch user messages
 * @access PRIVATE
 */
router.post("/api/user/messages", auth_check, (req, res, next) => {
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
 * @route    GET /api/user/messages/:userId
 * @description Fetch messages notification
 * @access PRIVATE
 */
router.get("/api/user/messages/:userId", auth_check, (req, res, next) => {
  Message.aggregate()
    .match({ receiver: req.profile._id, isNewMessage: true })
    .group({ _id: "$sender", count: { $sum: 1 } })
    .lookup({
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "users",
    })
    .unwind("$users")
    .project("users.name count")
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log("err", error);
    });
});

/**
 * @route    PUT /api/user/newFollowerStatusChange/:userId
 * @description Edit newFollowers flag
 * @access PRIVATE
 */
router.put(
  "/api/user/newFollowerStatusChange/:userId",
  auth_check,
  userController.newFollowerStatusChagne
);

/**
 * @route    PUT /api/user/messageStatusChange/:userId
 * @description Edit newMessage flag
 * @access PRIVATE
 */
router.put(
  "/api/user/messageStatusChange/:userId",
  auth_check,
  userController.messageStatusChange
);

/**
 * @route    PUT /api/user/follow/:userId
 * @description Follow user
 * @access PRIVATE
 */
router.put(
  "/api/user/follow/:userId",
  auth_check,
  userController.addFollowing,
  userController.addFollower
);

/**
 * @route    PUT /api/user/unfollow/:userId
 * @description Unfollow user
 * @access PRIVATE
 */
router.put(
  "/api/user/unfollow/:userId",
  auth_check,
  userController.removeFollowing,
  userController.removeFollower
);

/**
 * @route    GET /api/users
 * @description Fetch users
 * @access PRIVATE
 */
router.get("/api/users", auth_check, userController.getUsers);

/**
 * @route    GET /api/user/:userId
 * @description Fetch user
 * @access PRIVATE
 */
router.get("/api/user/:userId", auth_check, userController.getUser);

/**
 * @route    PUT /api/user/:userId
 * @description Update user
 * @access PRIVATE
 */
router.put(
  "/api/user/:userId",
  auth_check,
  userController.hasAuthorization,
  multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
    },
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
 * @route    DELETE /api/user/:userId
 * @description Delete user
 * @access PRIVATE
 */
router.delete(
  "/api/user/:userId",
  auth_check,
  userController.hasAuthorization,
  userController.deleteUser
);

/**
 * @route    GET /api/user/findpeople/:userId
 * @description Find people
 * @access PRIVATE
 */
router.get(
  "/api/user/findpeople/:userId",
  auth_check,
  userController.findPeople
);

/**
 * @route    GET /api/user/getonline/:userId
 * @description Fetch online users
 * @access PRIVATE
 */
router.get(
  "/api/user/getonline/:userId",
  auth_check,
  userController.getOnlinePeople
);

/**
 * @route    GET /api/user/newusers/:userId
 * @description Fetch new registered users
 * @access PRIVATE
 */
router.get(
  "/api/user/newusers/:userId",
  auth_check,
  userController.dailyNewUsers
);

/**
 * @route    GET /api/user/onlinetoday/:userId
 * @description Fetch current online users
 * @access PRIVATE
 */
router.get(
  "/api/user/onlinetoday/:userId",
  auth_check,
  userController.userOnlineToday
);

/**
 * @route    GET /api/user/onlinenow/:userId
 * @description Fetch online users
 * @access PRIVATE
 */
router.get(
  "/api/user/onlinenow/:userId",
  auth_check,
  userController.userOnlineNow
);

/**
 * @route    PARAM /:userId
 * @description Store user in request object
 * @access PUBLIC
 */
router.param("userId", userController.userById);

module.exports = router;
