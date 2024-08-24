const express = require("express");
const router = express.Router();
const { getPatientProfile,
    editPatientProfile,
    patientViewUpcomingProceedingAppointments,
    patientViewHistoryAppointments,
    patientViewTreatmentList,
    patientViewTreatmentNote } = require("../controllers/patientController");
const authMiddleware = require("../middleware/authMiddleware")

router.get("/patient-profile", authMiddleware(["patient"]), getPatientProfile); // get patient profile function
router.post("/edit-profile", authMiddleware(["patient"]), editPatientProfile);
router.get("/upcoming-appointment", authMiddleware(["patient"]), patientViewUpcomingProceedingAppointments);
router.get("/past-appointment", authMiddleware(["patient"]), patientViewHistoryAppointments);
router.get("/treatments", authMiddleware(["patient"]), patientViewTreatmentList);
router.get("/treatment-note/:appointment_id", authMiddleware(["patient"]), patientViewTreatmentNote);

module.exports = router;