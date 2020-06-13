const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { body, validationResult } = require("express-validator");
const userController = require("../controllers/user");
const auth_check = require("../middleware/auth-check");
const User = require("../models/user");
const md5 = require("md5");
const jwt = require("jsonwebtoken");

/**
  * @route    POST /api/signup
  * @description Signup User
  * @access PUBLIC
 */
router.post(
  "/api/signup",
  [
    body("name").notEmpty().withMessage("Name feild is required."),
    body("email").notEmpty().withMessage("Email feild is required."),
    body("email").isEmail().normalizeEmail().withMessage("Not a valid email."),
    body("password").notEmpty().withMessage("Password feild is required."),

    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be 5 character long."),
  ],
  authController.postSignup
);

/**
  * @route    POST /api/social-login
  * @description Signup User With Social Network
  * @access PUBLIC
 */
router.post("/api/social-login", authController.socialLogin);

/**
  * @route    POST /api/signin
  * @description Login User
  * @access PUBLIC
 */
router.post("/api/signin", authController.postSignin);

/**
  * @route    POST /api/changePassword
  * @description Change Password
  * @access PRIVATE
 */
router.post(
  "/api/changePassword",
  [
    body("password").notEmpty().withMessage("Password feild is required."),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be 6 character long."),
    body("password_confirmation").custom((password, { req }) => {
      if (password !== req.body.password) {
        //return Promise.reject("Password confirmation does not match password");
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  ],
  auth_check,
  (req, res, next) => {
    const errs = validationResult(req);

    if (!errs.isEmpty()) {
      const errors = errs.array();
      return res.status(422).json({
        errors,
      });
    }
  },
  authController.chnagePassword
);

/**
  * @route    PUT /api/forgot-password
  * @description Forget Password
  * @access PUBLIC
 */
router.put("/api/forgot-password", authController.forgetPassword);

/**
  * @route    PUT /api/reset-password
  * @description Reset Password
  * @access PUBLIC
 */
router.put(
  "/api/reset-password",
  [
    body("newPassword").notEmpty().withMessage("This field is required"),
    body("newPassword")
      .isLength({ min: 5 })
      .withMessage("Password must be 5 character long."),
  ],
  authController.resetPassword
);

/**
  * @route    GET /api/signout
  * @description User Signout
  * @access PRIVATE
 */
router.get(
  "/api/signout",
  auth_check,
  (req, res, next) => {
    jwt.sign({}, process.env.JWT_KEY, { expiresIn: 0 });
    next();
  },
  (req, res, next) => {
    User.updateOne(
      { _id: req.auth._id },
      { isLoggedIn: false, lastLoggedIn: Date.now() }
    ).then((result) => {
      res.status(200).json({
        msg: "Logout Success",
        isLoggedIn: false,
      });
      /*  .catch((err) => {
          if (err) {
            console.log("error while updating flag");
          }
        }); */
    });
  }
);


/**
  * @route    PARAM /:USERiD
  * @description Store user data in req object
  * @access PRIVATE
 */
router.param("userId", userController.userById);

module.exports = router;
