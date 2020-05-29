require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    let token;
    token = req.headers.authorization.split(" ")[1];
    if (!token) {
      //return res.status(401).json({ msg: "Autherization failed" });
      const err = new Error("Unauthorzed Access");
      return next(err);
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    console.log("auth__");

    /* Checking User Existence */
    /* Checking User Existence */

    req.auth = {
      _id: decodedToken._id,
      role: decodedToken.role,
      isAuthorized: true,
    };
    User.findById({ _id: req.auth._id });
    next();
  } catch (error) {
    /* return res.status(401).json({ msg: "Autherization failed" }); */
    console.log("unauthorized__");
    req.isAuthorized = false;
    return next(new Error("Unauthorzed Access"));
  }
};
