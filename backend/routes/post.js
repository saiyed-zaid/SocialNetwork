const express = require("express");
const router = express.Router();
const postController = require("../controller/post");
const { body } = require("express-validator");

router.get("/", postController.getPosts);

/* Checking Autherization */
router.use((req, res, next) => {
 /*  if (req.method === "OPTIONS") {
    return next();
  } */
 /*  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log("__TOKEN", token);
    if (!token) {
    return  res.status(401).json({ msg: "Autherization failed" });
    }
    const decodedToken = jwt.verify("MysecreatKey");
    req.userData = { email: decodedToken.email };
    next();
  } catch (error) {
    return  res.status(401).json({ msg: "Autherization failedd" });
  } */
  next();
});
/* Checking Autherization */

router.post(
  "/post",
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
