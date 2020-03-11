const User = require("../model/user");
const _ = require("lodash");

const formidable = require("formidable");
const fs = require("fs");

exports.userById = async (req, res, next, id) => {
  try {
    const user = await User.findById(id)
      .populate("following", "_id name")
      .populate("followers", "_id name");
    if (!user) {
      return next(new Error("User not Found."));
    }
    req.profile = user;
  } catch (error) {
    return next(new Error("User not Found."));
  }
  next();
};

exports.hasAuthorization = (req, res, next) => {
  const authorized =
    req.profile && req.auth && req.profile._id === req.auth._id;
  if (!authorized) {
    res.status(401).json({
      msg: "Not an Auhtorized user to take this action"
    });
  }
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

  user = _.extend(user, req.body);
  user.updated = Date.now();

  user.photo = req.file;

  user.save(req.body, async (err, result) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    } else {
      user.hashed_password = undefined;
      user.salt = undefined;
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
    res.json({ msg: "User Deleted succesfully" });
  } catch (error) {
    res.json({
      msg: "Error while deleting profile"
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
      .populate("following", "_id name photo")
      .populate("followers", "_id name photo");
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
          following: req.body.userId
        }
      },
      {
        $new: true
      }
    )
      .populate("following", "_id name photo")
      .populate("followers", "_id name photo");
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
    const users = await User.find({ _id: { $nin: following } }).select(
      "name photo"
    );
    await res.json(users);
  } catch (error) {
    res.status(400).json({ err: error });
  }
};
