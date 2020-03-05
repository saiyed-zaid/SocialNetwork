/* Import Required Packages BEGIN*/
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

//Make sure u change `getRoutes` variable name

const getRoutes = require("./routes/post");
const authRoute = require("./routes/auth");
/* Import Required Packages END*/

/* Registering middleware BEGIN*/
app.use(bodyParser.json());
/* Registering middleware END*/

/* Handling Requests BEGIN */
app.use(morgan("tiny"));
app.use((req, res, next) => {
  //Which domain can acces it
  res.setHeader("Access-Control-Allow-Origin", "*");

  //allowed headers for client to set
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  //methods that can be supported by client requirest
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});
app.use(getRoutes);
app.use(authRoute);
/* Handling Requests END */

/* Error Handling Middleware BEGIN */
app.use((error, req, res, next) => {});
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
