/* Import Required Packages BEGIN*/
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const multer = require("multer");
dotenv.config();

//Make sure u change `getRoutes` variable name

const getRoutes = require("./routes/post");
const authRoute = require("./routes/auth");
const userRoutes = require("./routes/user");
/* Import Required Packages END*/

const MulterStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(err, "upload");
  },
  filename: (req, file, cb) => {
    cb(err, file.originalname);
  }
});

/* Registering middleware BEGIN*/
app.use(
  multer({
    storage: MulterStorage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/jpg" || file.mimetype == "image/jpeg")
        cb(err, true);
    }
  }).single("img")
);
app.use(bodyParser.json());
app.use(morgan("tiny"));
/* Registering middleware END*/

/* Handling Requests BEGIN */
app.use((req, res, next) => {
  //Which domain can acces it
  res.setHeader("Access-Control-Allow-Origin", "*");

  //allowed headers for client to set
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  //methods that can be supported by client requirest
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,PUT");

  next();
});
app.use(userRoutes);
app.use(authRoute);
app.use(getRoutes);
/* Handling Requests END */

/* Error Handling Middleware BEGIN */
app.use((error, req, res, next) => {
  res.status(401).json({
    message: error.message
  });
});
/* Error Handling Middleware END */

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(result => {
    console.log("Connected with Mongodb");
    app.listen(5000);
  })
  .catch(err => {
    console.log("Error while connecting with database", err);
  });
