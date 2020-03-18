const User = require("../models/user");
const _ = require("lodash");
const fs = require("fs");
const md5 = require("md5");

exports.userById = async (req, res, next, id) => {
  try {
    const user = await User.findById(id)
      .populate("following", "_id name photo")
      .populate("followers", "_id name photo");
    if (!user) {
      return next(new Error("User not Found."));
    }
    req.profile = user;
    console.log("data___", req.profile);
    next();
  } catch (error) {
    return next(new Error("User not Found."));
  }
};

exports.hasAuthorization = (req, res, next) => {
  console.log("auth___");
  /*   console.log('Role_',req.auth.role);
  console.log('Profile',req.profile);
  console.log('Auth',req.auth); */

  if (req.auth.role != "admin" && req.auth.role != "subscriber") {
    return res.json({ msg: "Not authorized user for this action." });
  }
  if (req.auth.role == "admin") {
    //return res.json({ msg: "is admin" });

    return next();
  }

  if (req.auth._id != req.profile._id) {
    return res.json({
      msg: "Not authorized user for this action id not matched."
    });
  }
  next();
};

/**
 * @function middleware
 * @description Handling get request which fetch all Users
 */
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select(
      "_id name email created updated photo"
    );
    if (!users) {
      return res.json({
        msg: "No User Found"
      });
    }

    return res.json({ users });
  } catch (error) {
    return res.status(404).json({
      msg: "No User Found"
    });
  }
};

/**
 * @function get
 * @description Handling get request which fetch single User
 */
exports.getUser = async (req, res, next) => {
  req.profile.password = undefined;
  /* console.log("userid", req.profile._id); */
  return res.json(req.profile);
};

/**
 * @function middleware
 * @description Handling put request which Update single user
 */
exports.updateUser = async (req, res, next) => {
  let user = req.profile;

  if (user.photo) {
    fs.unlink(user.photo.path, err => {
      console.log("Error while unlink user image", err);
    });
  }

  if (!req.file) {
    req.file = user.photo;
  }
  if (req.body.password) {
    req.body.password = md5(req.body.password);
  } else {
    req.body.password = user.password;
  }
  user = _.extend(user, req.body);
  user.updated = Date.now();

  user.photo = req.file;

  user.save(req.body, async (err, result) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    } else {
      user.password = undefined;
      await res.json(user);
    }
  });
};

/**
 * @function middleware
 * @description Handling delete request which delete single user
 */
exports.deleteUser = async (req, res, next) => {
  let user = req.profile;
  try {
    const result = await user.remove();
    res.json({ msg: "User Deleted succesfully", isDeleted: true });
  } catch (error) {
    res.json({
      msg: "Error while deleting profile",
      isDeleted: false
    });
  }
};

/**
 * @function middleware
 * @description Handling put request which add following
 */
exports.addFollowing = async (req, res, next) => {
  try {
    //req.body.userId
    const result = await User.findByIdAndUpdate(req.body.userId, {
      $push: {
        following: req.body.followId
      }
    });
    next();
  } catch (error) {
    return res.status(400).json({
      err: error
    });
  }
};
/**
 * @function middleware
 * @description Handling put request which add followers
 */
exports.addFollower = async (req, res, next) => {
  try {
    //req.body.userId
    const result = await User.findByIdAndUpdate(
      req.body.followId,
      {
        $push: {
          followers: req.body.userId
        }
      },
      {
        $new: true
      }
    )
      .populate("following", "_id name")
      .populate("followers", "_id name");
    res.json(result);
  } catch (error) {
    return res.status(400).json({
      err: error
    });
  }
};

/**
 * @function middleware
 * @description Handling put request which remove following
 */
exports.removeFollowing = async (req, res, next) => {
  try {
    //req.body.userId
    const result = await User.findByIdAndUpdate(req.body.userId, {
      $pull: {
        following: req.body.unfollowId
      }
    });
    next();
  } catch (error) {
    return res.status(400).json({
      err: error
    });
  }
};
/**
 * @function middleware
 * @description Handling put request which remove followers
 */
exports.removeFollower = async (req, res, next) => {
  try {
    //req.body.userId
    const result = await User.findByIdAndUpdate(
      req.body.unfollowId,
      {
        $pull: {
          followers: req.body.userId
        }
      },
      {
        $new: true
      }
    )
      .populate("following", "_id name")
      .populate("followers", "_id name");
    res.json(result);
  } catch (error) {
    return res.status(400).json({
      err: error
    });
  }
};

exports.findPeople = async (req, res, next) => {
  let following = req.profile.following;
  following.push(req.profile._id);
  try {
    const users = await User.find({ _id: { $nin: following } })
      .select("name photo")
      .populate("following", "_id")
      .populate("followers", "_id");
    await res.json(users);
  } catch (error) {
    res.status(400).json({ err: error });
  }
};
