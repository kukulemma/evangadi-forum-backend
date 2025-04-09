const express = require("express");
const router = express.Router();

//  authentication middleware
const authMiddleware = require("../middleware/authMiddleware");

// user controller
const { register, login, checkUser } = require("../controller/userController");

// register routes

router.post("/register", register);

// login user
router.post("/login", login);

// Authentication Middleware
router.get("/check", authMiddleware, checkUser);

module.exports = router;
