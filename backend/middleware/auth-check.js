module.exports = async (req, res, next) => {
    if (req.method === "OPTIONS") {
      return next();
    }
    try {
      let token;
      token = req.headers.authorization.split(" ")[1];
  
      console.log("__TOKEN", token);
      
      if (!token) {
        return res.status(401).json({ msg: "Autherization failed" });
      }
      const decodedToken = jwt.verify(token, process.env.JWT_KEY);
  
      req.userData = { email: decodedToken.email };
      next();
    } catch (error) {
      return res.status(401).json({ msg: "Autherization failed" });
    }
  };