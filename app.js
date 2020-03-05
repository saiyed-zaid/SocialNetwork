/* Import Required Packages BEGIN*/
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
/* Import Required Packages END*/

/* Registering middleware BEGIN*/
app.use(bodyParser.json);
/* Registering middleware END*/

/* Handling Requests BEGIN */
app.use("/", (req, res, next) => {});
/* Handling Requests END */

/* Error Handling Middleware BEGIN */
app.use((error, req, res, next) => {});
/* Error Handling Middleware END */

app.listen(process.env.PORT || 3000);
