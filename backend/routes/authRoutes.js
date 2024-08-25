const express = require("express");
const router = express.Router();
const { login, signup } = require("../controllers/authController");


router.post("/signup", signup); // Only patient signup
router.post("/login", login); // Login function


module.exports = router;
