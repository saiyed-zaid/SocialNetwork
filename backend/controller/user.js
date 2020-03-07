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

exports.getUser = async (req, res, next) => {
  req.profile.password = undefined;
  console.log("userid", req.userId);
  return res.json(req.profile);
};

exports.updateUser = async (req, res, next) => {
  let user = req.profile;

  user = _.extend(user, req.body);
  user.updated = Date.now();
  try {
    const result = await user.save();
    user.password = undefined;
    res.json({ user });
  } catch (error) {
    res.json({
      msg: "Error while updating profile"
    });
  }
};

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
