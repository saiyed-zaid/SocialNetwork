const express = require("express");
const router = express.Router();
const userController = require("../controller/user");
const auth_check = require("../middleware/auth-check");
router.get("/api/users", userController.getUsers);
router.get("/api/user/:userId", auth_check, userController.getUser);
router.patch("/api/user/:userId", auth_check, userController.updateUser);
router.delete("/api/user/:userId", auth_check, userController.deleteUser);
router.param("userId", userController.userById);


module.exports = router;
