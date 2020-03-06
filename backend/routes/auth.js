const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const { body } = require("express-validator");

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
router.post("/api/signin", authController.postSignin);

router.get("/api/logout", (req, res, next) => {
  res.json({
    msg: "Logoun Success"
  });
});

module.exports = router;
