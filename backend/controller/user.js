const User = require("../model/user");
const _ = require("lodash");


exports.userById = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
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
    const users = await User.find().select("_id name email created updated");
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
  console.log("userid", req.userId);
  return res.json(req.profile);
};

/**
 * @function middleware
 * @description Handling put request which Update single user
  */
exports.updateUser = async (req, res, next) => {
  /* User.updateOne({_id:req.profile._id},req.body) */
  let user = req.profile;
  //req.file.path
  console.log('REQ.DATA_____',req.body);
  user = _.extend(user, req.body);
  user.updated = Date.now();
  try {
    const result = await User.updateOne({_id:req.profile._id},req.body)
    user.password = undefined;
    res.json({ user });
  } catch (error) {
    res.json({
      msg: "Error while updating profile"
    });
  }
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
