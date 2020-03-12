const User = require("../model/user");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

/**
 * @function middleware
 * @description Handling post request for creating new post
 */
exports.postSignup = async (req, res, next) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    const err = errs.array()[0].msg;
    return res.status(422).json({
      msg: err
    });
  }
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(403).json({ msg: "Email already exists" });
    }
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: md5(req.body.password)
    });
    await user.save();
    res.status(200).json({ msg: "Signup successfully, proced to login!" });
  } catch (error) {
    res.status(422).json({ msg: "Error while creating User" });
  }
};

/**
 * @function middleware
 * @description Handling post request for handling login data
 */
exports.postSignin = async (req, res, next) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (!userExists) {
    return res.status(422).json({
      msg: "User with this email does not exists",
      user: {}
    });
  }
  if (userExists.password !== md5(req.body.password)) {
    return res.status(422).json({
      msg: "Incorrect password.",
      user: {}
    });
  }

  let token;
  token = jwt.sign(
    {
      _id: userExists._id,
      name: userExists.name,
      email: userExists.email,
      token: token
    },
    process.env.JWT_KEY,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Logged in!",
    user: {
      _id: userExists._id,
      name: userExists.name,
      email: userExists.email,
      token: token
    }
  });
};
