/* Import Required Packages BEGIN*/
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const getRoutes = require("./routes/post");
/* Import Required Packages END*/

/* Registering middleware BEGIN*/
app.use(bodyParser.json());
/* Registering middleware END*/

/* Handling Requests BEGIN */
app.use(morgan("tiny"));
app.use(getRoutes);
/* Handling Requests END */

/* Error Handling Middleware BEGIN */
app.use((error, req, res, next) => {});
/* Error Handling Middleware END */

mongoose
  .connect(process.env.MONGO_URI,{ useNewUrlParser: true,useUnifiedTopology: true })
  .then(result => {
    console.log("Connected with Mongodb");
    app.listen(5000);
  })
  .catch(err => {
    console.log("Error while connecting with database", err);
  });
