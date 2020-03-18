const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { body } = require("express-validator");
const userController = require("../controllers/user");

/**
 * @function post
 * @description Handling post request for creating new post
 * @param {String} path of router
 * @param {array} validations
 * @param {property} controller name
 */
router.post(
  "/api/signup",
  [
    body("name")
      .notEmpty()
      .withMessage("Name feild is required."),
    body("email")
      .notEmpty()
      .withMessage("Email feild is required."),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Not a valid email."),
    body("password")
      .notEmpty()
      .withMessage("Password feild is required."),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be 5 character long.")
  ],
  authController.postSignup
);

/**
 * @function post
 * @description Handling post request for handling login with social
 * @param {String} path of router
 * @param {property} controller postSignin
 */
router.post("/api/social-login", authController.socialLogin);

/**
 * @function post
 * @description Handling post request for handling login data
 * @param {String} path of router
 * @param {property} controller name
 */
router.post("/api/signin", authController.postSignin);

/**
 * @function put
 * @description Handling put request which send mail for forget password
 * @param {middleware} forgetPassword
 */

router.put("/api/forgot-password", authController.forgetPassword);

/**
 * @function put
 * @description Handling put request which Reset user password
 * @param {middleware} resetPassword
 */
router.put(
  "/api/reset-password",
  [
    body("newPassword")
      .notEmpty()
      .withMessage("This field is required"),
    body("newPassword")
      .isLength({ min: 5 })
      .withMessage("Password must be 5 character long.")
  ],
  authController.resetPassword
);

router.get("/api/signout", (req, res, next) => {
  res.json({
    msg: "Logout Success"
  });
});

/**
 * @function param
 * @description Invoked whenever param with userId appended in url and store user data in req object
 * @param {String} param name
 * @param {property} property userId
 */
router.param("userId", userController.userById);

module.exports = router;
