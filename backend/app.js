/* Import Required Packages BEGIN*/
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require('morgan');

const getRoutes = require('./routes/get');
/* Import Required Packages END*/


/* Registering middleware BEGIN*/
app.use(bodyParser.json());
/* Registering middleware END*/

/* Handling Requests BEGIN */
app.use(morgan('tiny'));
app.use(getRoutes);
/* Handling Requests END */

/* Error Handling Middleware BEGIN */
app.use((error, req, res, next) => {});
/* Error Handling Middleware END */

app.listen(5000);
