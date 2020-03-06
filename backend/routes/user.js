const express = require("express");
const router = express.Router();
const userController = require('../controller/user');
router.get("/api/users",userController.getUsers);

module.exports = router;
