const User = require("../models/user");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const sendMail = require("../helper/mailer");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");

/**
 * @function middleware
 * @description Handling post request for creating new USER
 */
exports.postSignup = async (req, res, next) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    const err = errs.array()[0].msg;
    return res.status(422).json({
      err,
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
      password: md5(req.body.password),
      dob: req.body.dob,
    });

    user
      .save()
      .then((result) => {
        /* const destPosts = path.join(
          __dirname,
          "..",
          "upload",
          String(user._id),
          "posts"
        );

        const destProfile = path.join(
          __dirname,
          "..",
          "upload",
          String(user._id),
          "profile"
        );

        // Creating Directory For This User BEGIN
        if (!fs.existsSync(destPosts) && !fs.existsSync(destProfile)) {
          fs.mkdirSync(
            String(
              path.join(__dirname, "..", "upload", "users") +
                "/" +
                String(user._id) +
                "/" +
                "profile"
            ),
            { recursive: true }
          );

          fs.mkdirSync(
            String(
              path.join(__dirname, "..", "upload", "users") +
                "/" +
                String(user._id) +
                "/" +
                "posts"
            ),
            { recursive: true }
          );
        } else {
          console.log("Directory Not created successfully");
        }
         */ /* Creating Directory For This User OVER */
        res.status(200).json({ msg: "Signup successfully, proced to login!" });
      })
      .catch((err) => {
        console.log("Error While Creating user", err);
      });
  } catch (error) {
    res.status(422).json({ msg: "Something went wrong..." });
  }
};

/**
 * @function middleware
 * @description Handling post request for handling LOGIN
 */
exports.postSignin = async (req, res, next) => {
  const userExists = await User.findOne({
    $and: [
      {
        email: req.body.email,
      },
      {
        password: md5(req.body.password),
      },
    ],
  });

  if (!userExists) {
    return res.status(422).json({
      error: "Username or Password is Incorrect..",
    });
  }

  if (!userExists.status) {
    return res.status(422).json({
      error: "Your account is deactiveted, Please contact admin.",
    });
  }

  /* Updatting isLoggedIn and lastLoggedIn fields */
  User.updateOne(
    { email: req.body.email },
    { isLoggedIn: true, lastLoggedIn: Date.now() }
  )
    .then((result) => {
      console.log("Logged in Flag updated");
    })
    .catch((err) => {
      if (err) {
        console.log("Loggedin flag not updated");
      }
    });

  let token;
  token = jwt.sign(
    {
      _id: userExists._id,
      name: userExists.name,
      email: userExists.email,
      role: userExists.role,
      photo: userExists.photo,
      token: token,
    },
    process.env.JWT_KEY,
    { expiresIn: "1h" }
  );

  res.json({
    msg: "Logged in!",
    user: {
      _id: userExists._id,
      name: userExists.name,
      email: userExists.email,
      role: userExists.role,
      photo: userExists.photo,
      lastLoggedIn: Date.now(),
      token: token,
    },
  });
};

exports.chnagePassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ password: md5(req.body.oldPassword) });
    if (!user) {
      return res.status(422).json({
        errors: [
          {
            param: "oldPassword",
            msg: "Old Password Does Not Matched.",
          },
        ],
      });
    }

    User.updateOne(
      { _id: req.auth._id },
      {
        $set: {
          password: md5(req.body.password),
        },
      },
      (data) => {
        return res.json({
          msg: "Password Changed Successfully",
        });
      }
    );
  } catch (error) {
    console.log("errr", error);
  }
};

exports.forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) {
      return res.json("User with this email does not exists");
    }
    //sign token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
      expiresIn: 300,
    });

    const emailData = {
      from: "zss@narola.email",
      to: email,
      subject: "Password Reset Instructions",
      text: `Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
      html: `<p>Please use the following link to reset your password:</p> <a href='${process.env.CLIENT_URL}/reset-password/${token}'>click here.</a>`,
    };

    user.updateOne(
      {
        resetPasswordLink: token,
      },
      (err, data) => {
        if (err) {
          return res.json({ error: err });
        } else {
          sendMail(emailData);
          return res.status(200).json({
            message: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
          });
        }
      }
    );
  });
};

exports.resetPassword = async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    const err = errs.array()[0].msg;
    return res.status(422).json({
      msg: err,
    });
  }
  const { resetPasswordLink, newPassword } = req.body;

  try {
    const user = await User.findOne({ resetPasswordLink });

    const updatedFields = {
      password: md5(newPassword),
      resetPasswordLink: "",
    };
    user.updated = Date.now();

    const userData = _.extend(user, updatedFields);

    await userData.save();
    res.json({
      message: `Great! Now you can login with your new password.`,
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
        expiresIn: "1h",
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
        expiresIn: "1h",
      });
      // return response with user and token to frontend client
      const { _id, name, email } = user;
      return res.json({ user: { token, _id, name, email } });
    }
  });
};
