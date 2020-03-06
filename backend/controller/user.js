const User = require("../model/user");
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
