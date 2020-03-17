const User = require("../model/user");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const sendMail = require("../helper/mailer");
const _ = require("lodash");
const cookieParser = require("cookie-parser");

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
  /* res.cookie("t", token, { expire: new Date() + 9999 }); */
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
exports.forgetPassword = async (req, res, next) => {
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

    user.updateOne(
      {
        resetPasswordLink: token
      },
      (err, data) => {
        if (err) {
          return res.json({ error: err });
        } else {
          sendMail(emailData);
          return res.status(200).json({
            message: `Email has been sent to ${email}. Follow the instructions to reset your password.`
          });
        }
      }
    );
  });
};

exports.resetPassword = async (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  try {
    const user = await User.findOne({ resetPasswordLink });
    console.log("data_", user);

    const updatedFields = {
      password: md5(newPassword),
      resetPasswordLink: ""
    };
    user.updated = Date.now();

    const userData = _.extend(user, updatedFields);

    await userData.save();
    res.json({
      message: `Great! Now you can login with your new password.`
    });
  } catch (error) {
    return res.status("401").json(error);
  }
};

exports.socialLogin = (req, res, next) => {
  // try signup by finding user with req.email
  let user = User.findOne({ email: req.body.email }, (err, user) => {
    if (err || !user) {
      // create a new user and login
      user = new User(req.body);
      req.profile = user;
      user.save();
      // generate a token with user id and secret
      const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
        expiresIn: "1h"
      });
      // return response with user and token to frontend client
      const { _id, name, email } = user;
      return res.json({ user: { token, _id, name, email } });
    } else {
      // update existing user with new social info and login
      req.profile = user;
      user = _.extend(user, req.body);
      user.updated = Date.now();
      user.save();
      // generate a token with user id and secret
      const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
        expiresIn: "1h"
      });
      // return response with user and token to frontend client
      const { _id, name, email } = user;
      return res.json({ user: { token, _id, name, email } });
    }
  });
};
