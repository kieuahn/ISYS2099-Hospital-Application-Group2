const express = require("express");
const router = express.Router();
const upload = require('../middleware/multerMiddleware');
const authMiddleware = require("../middleware/authMiddleware")
const {doctorViewUpcomingProceedingAppointment,
    doctorViewCompletedAppointment,
    doctorViewTreatmentNote,
    doctorUpdateTreatmentNote,
    viewDoctorSchedules,
    doctorAddSchedule,
    doctorDeleteSchedule} = require("../controllers/doctorController");

router.get("/upcoming-appointment", authMiddleware(["Doctor"]), doctorViewUpcomingProceedingAppointment);
router.get("/past-appointment", authMiddleware(["Doctor"]), doctorViewCompletedAppointment);
router.get("/treatment-note/:appointment_id", authMiddleware(["Doctor"]), doctorViewTreatmentNote);
router.post("/treatment/update/:treatment_id", authMiddleware(["Doctor"]), upload.single('diagnostic_image'), doctorUpdateTreatmentNote);
router.get("/doctor-schedule", authMiddleware(["Doctor"]), viewDoctorSchedules);
router.post("/add-schedule", authMiddleware(["Doctor"]), doctorAddSchedule);
router.post("/delete-schedule/:schedule_id", authMiddleware(["Doctor"]), doctorDeleteSchedule)

module.exports = router;