require("dotenv").config();
const jwt = require("jsonwebtoken");
module.exports = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    let token;
    token = req.headers.authorization.split(" ")[1];

    //console.log("__TOKEN", token);

    if (!token) {
      //return res.status(401).json({ msg: "Autherization failed" });
      const err = new Error("Unauthorzed Access");
      return next(err);
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);

    req.auth = { _id: decodedToken._id,role: decodedToken.role };

    next();
  } catch (error) {
    /* return res.status(401).json({ msg: "Autherization failed" }); */
    const err = new Error("Unauthorzed Access");
    return next(err);
  }
};
