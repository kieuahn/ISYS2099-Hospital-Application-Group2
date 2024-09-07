const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController'); 
const authMiddleware = require('../middleware/authMiddleware');
const managerController = require("../controllers/managerController");


// Route for admin
router.get("/staff", authMiddleware(['Admin']), adminController.getAllStaff);

// Route to add a new doctor
router.post('/add-staff', authMiddleware(['Admin', 'Manager']), adminController.addStaff);
router.get('/departments', authMiddleware(['Admin']), adminController.getAllDepartments);
router.get('/doctor-schedules', authMiddleware(['Admin', 'Manager']), adminController.getDoctorSchedules);

// Additional routes for filtering, updating, etc.
router.get('/staff-by-department', authMiddleware(['Admin']), adminController.getStaffByDepartment);
router.get("/staff-by-name",authMiddleware(['Admin']), adminController.getStaffByName);
router.put('/staff/:id', authMiddleware(['Admin', 'Manager']), adminController.updateStaff);
router.delete('/staff/:id', authMiddleware(['Admin']), adminController.deleteStaff);

router.get('/patient/:patient_id/treatment-history', authMiddleware(['Admin', 'Manager']), managerController.getPatientTreatmentHistory);
router.get('/doctors/workload', authMiddleware(['Admin']), adminController.getAllDoctorsWorkload);
router.get('/doctor/:doctor_id/workload', authMiddleware(['Admin']), adminController.getDoctorWorkload);

router.get('/staff/:staff_id/job-history', authMiddleware(['Admin']), adminController.getJobHistory);
router.get('/patients/search', authMiddleware(['Admin', 'Manager']), adminController.searchPatient);
router.get('/patients/:patient_id/treatment-history', authMiddleware(['Admin']), adminController.getPatientTreatmentHistory);
router.get('/patients/treatment-history', authMiddleware(['Admin']), adminController.getPatientTreatmentHistory);




module.exports = router;
