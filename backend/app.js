/* Import Required Packages BEGIN*/
const express = require("express");
const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server);

const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const Message = require("./models/messages");

dotenv.config();
/* Import Required Packages END*/

/* Importing Routes BEGIN*/
const postRoutes = require("./routes/post");
const authRoute = require("./routes/auth");
const userRoutes = require("./routes/user");
/* Importing Routes END*/

//Make /upload folder public
app.use("/upload", express.static("upload"));

/* Registering middleware BEGIN*/
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("tiny"));
/* Registering middleware END*/

/* Handling Requests BEGIN */
app.use(userRoutes);
app.use(authRoute);
app.use(postRoutes);
/* Handling Requests END */

/* Error Handling Middleware BEGIN */
app.use((error, req, res, next) => {
  res.status(401).json({
    err: error.message,
  });
});
/* Error Handling Middleware END */

/* Connecting with DATABASE BEGIN*/
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((result) => {
    server.listen(5000, () => {
      console.log('Server is up and running','Connected with mongoDb');
      io.on("connection", function (socket) {
        console.log("Client Connected");
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
  })
  .catch((err) => {
    console.log("Error while connecting with database", err);
  });
/* Connecting with DATABASE END*/
