const express = require("express");
const router = express.Router();
const {getPatientProfile} = require("../controllers/patientController");
const authMiddleware = require("../middleware/authMiddleware")

router.get("/patient-profile", authMiddleware, getPatientProfile) // get patient profile function

module.exports = router;