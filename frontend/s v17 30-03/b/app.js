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
/* Importing Routes BEGIN*/


app.use("/upload", express.static("upload"));
/* Registering middleware BEGIN*/

app.use(cors());
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
