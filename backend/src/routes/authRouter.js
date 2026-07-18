const express = require("express");
const { signup, login, logout } = require("../controllers/authController");
const router = express.Router();

router.post("/auth/signup", signup);

router.post("/auth/login", login);

router.get("/auth/logout", logout);

module.exports = router;
