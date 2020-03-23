/* Import Required Packages BEGIN*/
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
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
/* const MulterStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.path.includes("/api/user/") && req.method === "PUT") {
      console.log("1 REQ.COMES___");
      app.locals._id = req.path.split("/")[3];

      if (
        !fs.existsSync(
          path.join(
            __dirname,
            "upload",
            "users",
            req.path.split("/")[3],
            "profile"
          )
        )
      ) {
        fs.mkdirSync(
          path.join(__dirname, "upload", "users") +
            "/" +
            req.path.split("/")[3] +
            "/" +
            "profile",
          { recursive: true }
        );
      }
      cb(null, path.join("upload", "users", req.path.split("/")[3], "profile"));
    }   else if (req.path.includes("/api/post/") && req.method === "POST") {
      console.log('2 REQ.COMES___');
      app.locals._id = req.path.split("/")[3];

      if (
        !fs.existsSync(
          path.join(__dirname, "upload", "users", req.path.split("/")[3],'posts')
        )
      ) {
        fs.mkdirSync(
          path.join(__dirname, "upload", "users") +
            "/" +
            req.path.split("/")[3] +
            "/" +
            "posts",
          { recursive: true }
        );
      }
      cb(null, path.join("upload", "users", req.path.split("/")[3], "posts"));

    }else if (req.path.includes("/api/post/") && req.method === "PATCH") {
       console.log('3 REQ.COMES___');
      console.log(req.auth);
      console.log(req.post);
      console.log('USERID_',app.locals._id);
      //app.locals._id = req.path
      
      
      if (
        !fs.existsSync(
          path.join(__dirname, "upload", "users", app.locals._id,'posts')
        )
      ) {
        fs.mkdirSync(
          path.join(__dirname, "upload", "users") +
            "/" +
            app.locals._id +
            "/" +
            "posts",
          { recursive: true }
        );
      } 
      cb(null, path.join("upload", "users", req.path.split('/')[3], "posts"));

    } 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
}); */
/* Configes END */
app.use("/upload", express.static("upload"));
/* app.use(cookieParser); */
app.use(cors());
/* Registering middleware BEGIN*/
/* app.use(
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
    }
  }).single("photo")
); */
app.use(bodyParser.json());

app.use(morgan("tiny"));

app.use(userRoutes);
app.use(authRoute);
app.use(getRoutes);
/* Handling Requests END */

/* Error Handling Middleware BEGIN */
app.use((error, req, res, next) => {
  res.status(401).json({
    err: error.message
  });
});
/* Error Handling Middleware END */

/* Connecting with DATABASE BEGIN*/
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(result => {
    console.log("Connected with Mongodb");
    app.listen(5000);
  })
  .catch(err => {
    console.log("Error while connecting with database", err);
  });
/* Connecting with DATABASE END*/
