const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware")
const {doctorViewUpcomingProceedingAppointment,
    doctorViewCompletedAppointment,
    doctorViewTreatmentNote} = require("../controllers/doctorController");

router.get("/upcoming-appointment", authMiddleware(["doctor"]), doctorViewUpcomingProceedingAppointment);
router.get("/past-appoinment", authMiddleware(["doctor"]), doctorViewCompletedAppointment);
router.get("/treatment-note/:appointment_id", authMiddleware(["doctor"]), doctorViewTreatmentNote);

module.exports = router;