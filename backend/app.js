/* 
  Context: IMPORT Packages
*/
const express = require("express");
const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server);

const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const notifier = require("node-notifier");
const cors = require("cors");
const compression = require("compression");
const Message = require("./models/messages");

dotenv.config();

/* 
  Context: IMPORT Routes
*/
const postRoutes = require("./routes/post");
const authRoute = require("./routes/auth");
const userRoutes = require("./routes/user");
const notificationRoutes = require("./routes/notification");
const reportRoutes = require("./routes/report");

/* 
  Context: STATIC Directory
*/
app.use("/upload", express.static("upload"));

/* 
  Context: Create Writable Stream For LOG
*/
var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

/* 
  Context: Helper Middleware
*/
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(morgan("combined", { stream: accessLogStream }));

/* 
  Context: Handle HTTP Request (GET, POST, PUT, DELETE, PATCH, OPTIONS)
*/
app.use(userRoutes);
app.use(notificationRoutes);
app.use(authRoute);
app.use(postRoutes);
app.use(reportRoutes);

/* 
  Context: Handle Errors
*/
app.use((error, req, res, next) => {
  if (!req.isAuthorized) {
    res.status(401).json({
      isAuthorized: req.isAuthorized,
      err: error.message,
    });
  } else {
    res.json({
      err: error.message,
    });
  }
});

/* 
  Context: Database Connection
*/
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((result) => {
    notifier.notify({
      title: "Database Connection",
      message: "Mongodb Connected",
      icon: `${__dirname}/public/images/mongodb.png`,
    });
  })
  .catch((err) => {
    notifier.notify({
      title: "Database Connection",
      message: "Database Not Connected",
      icon: `${__dirname}/public/images/mongodb.png`,
    });
  });

/* 
  Context: Server Startup
*/
server.listen(process.env.PORT || 5000, () => {
  io.on("connection", function (socket) {
    socket.on("msg", function (data) {
      const msg = new Message(data);
      msg
        .save()
        .then((result) => {
          io.emit(data.receiver, data);
        })
        .catch((err) => {
          if (err) {
            console.log("Error while inserting message", err);
          }
        });
    });
  });
});
