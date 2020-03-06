const User = require("../model/user");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

exports.postSignup = async (req, res, next) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    const err = errs.array()[0].msg;
    console.log("error handler__", err);
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

    console.log("req data_", req.body);
    await user.save();
    res.status(200).json({ msg: "Signup successfully, proced to login!" });
  } catch (error) {
    console.log("Error while creating User", error);
    res.status(422).json({ msg: "Error while creating User" });
  }
};

exports.postSignin = async (req, res, next) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (!userExists) {
    return res.status(422).json({
      msg: "User with this email does not exists"
    });
  }
  if (userExists.password !== md5(req.body.password)) {
    return res.status(422).json({
      msg: "Incorrect password."
    });
  }

  let token;
  token = jwt.sign(
    { _id: userExists._id, email: userExists.email, token: token },
    process.env.JWT_KEY,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Logged in!",
    user:{
      _Id: userExists._id,
      email: userExists.email,
      token: token
    }
  });
};
