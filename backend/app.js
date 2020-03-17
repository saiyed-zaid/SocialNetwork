/* Import Required Packages BEGIN*/
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const multer = require("multer");

const cors = require("cors");

dotenv.config();
/* Import Required Packages END*/

/* Importing Routes BEGIN*/
//Make sure u change `getRoutes` variable name
const getRoutes = require("./routes/post");
const authRoute = require("./routes/auth");
const userRoutes = require("./routes/user");
/* var cookieParser = require('cookie-parser'); */
/* Importing Routes BEGIN*/

/* Configes BEGIN */
const MulterStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});
/* Configes END */
app.use("/upload", express.static("upload"));
/* app.use(cookieParser); */
app.use(cors());
/* Registering middleware BEGIN*/
app.use(
  multer({
    storage: MulterStorage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb(
          new Error("File type is invalid, allowed types [jpeg, jpg]."),
          false
        );
      }
      /* if (file.size > 200000) {
        console.log("NOT ALLOWED");
        cb(
          new Error(
            "File with " +
              req.file.size +
              " Size is not allowed, Allowed size[<=200kb]"
          ),
          false
        );
      } */
    }
  }).single("photo")
);
app.use(bodyParser.json());

app.use(morgan("tiny"));

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

/* Connecting with DATABASE BEGIN*/
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
/* Connecting with DATABASE END*/
