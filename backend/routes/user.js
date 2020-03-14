const express = require("express");
const router = express.Router();
const userController = require("../controller/user");
const auth_check = require("../middleware/auth-check");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const sendMail = require("../helper/mailer");

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
router.put("/api/user/:userId", auth_check, userController.updateUser);

/**
 * @function delete
 * @description Handling delete request which delete single user
 * @param {middleware} Checking Authorization
 * @param {middleware} deleteUser
 */
router.delete("/api/user/:userId", auth_check, userController.deleteUser);

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

router.put("/api/forgot-password", (req, res, next) => {
  const { email } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) {
      return res.json("User with this email does not exists");
    }
    //sign token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
      expiresIn: 300
    });

    const emailData = {
      from: "zss@narola.email",
      to: email,
      subject: "Password Reset Instructions",
      text: `Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
      html: `<p>Please use the following link to reset your password:</p> <a href='${process.env.CLIENT_URL}/reset-password/${token}'>click here.</a>`
    };
  console.table(emailData);


    user.updateOne(
      {
        resetPasswordLink: token
      },
      (err, data) => {
        if (err) {
          return res.json({ error: err });
        } else {
          sendMail(emailData);
            /* .then(result => {
              console.log("result", result);
            })
            .catch(err => {
              console.log("Error while sending mail", err);
            }); */
          return res.status(200).json({
            message: `Email has been sent to ${email}. Follow the instructions to reset your password.`
          });
        }
      }
    );
  });

  router.put("/api/reset-password", (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    User.findOne({ resetPasswordLink }, (err, user) => {
      // if err or no user
      if (err || !user)
        return res.status("401").json({
          error: "Invalid Link!"
        });

      const updatedFields = {
        password: newPassword,
        resetPasswordLink: ""
      };

      user = _.extend(user, updatedFields);
      user.updated = Date.now();

      user.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: err
          });
        }
        res.json({
          message: `Great! Now you can login with your new password.`
        });
      });
    });
  });

});

/**
 * @function router.param("userId", userController.userById);
 * @description Invoked callback function whenever userId appended in URL which fetch user data and stored in req object
 * @param {middleware} userById
 */
router.param("userId", userController.userById);

module.exports = router;
