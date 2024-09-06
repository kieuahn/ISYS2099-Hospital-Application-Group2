const express = require("express");
const router = express.Router();
const { getPatientProfile,
    editPatientProfile,
    patientViewUpcomingProceedingAppointments,
    patientViewHistoryAppointments,
    patientViewTreatmentList,
    patientViewTreatmentNote,
    patientViewDoctorList,
    patientViewDoctorBookingForm,
    patientBookAppointment,
    patientCancelAppointment} = require("../controllers/patientController");
const authMiddleware = require("../middleware/authMiddleware")

router.get("/patient-profile", authMiddleware(["Patient"]), getPatientProfile); // get patient profile function
router.post("/edit-profile", authMiddleware(["Patient"]), editPatientProfile);
router.get("/upcoming-appointment", authMiddleware(["Patient"]), patientViewUpcomingProceedingAppointments);
router.get("/past-appointment", authMiddleware(["Patient"]), patientViewHistoryAppointments);
router.get("/treatments", authMiddleware(["Patient"]), patientViewTreatmentList);
router.get("/treatment-note/:appointment_id", authMiddleware(["Patient"]), patientViewTreatmentNote);
router.get("/doctor-list", authMiddleware(["Patient"]), patientViewDoctorList);
router.get("/booking-form/:doctor_id", authMiddleware(["Patient"]), patientViewDoctorBookingForm);
router.post("/book-appointment/:doctor_id", authMiddleware(["Patient"]), patientBookAppointment);
router.post("/cancel-appointment/:appointment_id", authMiddleware(["Patient"]), patientCancelAppointment)

module.exports = router;