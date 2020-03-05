/* Import Required Packages BEGIN*/
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const getRoutes = require('./routes/get');
/* Import Required Packages END*/


/* Registering middleware BEGIN*/
app.use(bodyParser.json());
/* Registering middleware END*/

/* Handling Requests BEGIN */
app.get("/", getRoutes.getPosts);
/* Handling Requests END */

/* Error Handling Middleware BEGIN */
app.use((error, req, res, next) => {});
/* Error Handling Middleware END */

app.listen(3000);
