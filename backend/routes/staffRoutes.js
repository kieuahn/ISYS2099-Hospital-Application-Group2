const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const staffController = require('../controllers/staffController');


router.get('/patients', authMiddleware(['Admin', 'Manager']), staffController.getAllPatients);
// Routes accessible to both Admin and Manager, with role-based restrictions applied
router.post('/add-staff', authMiddleware(['Admin', 'Manager']), staffController.addStaff);
router.get('/staff', authMiddleware(['Admin', 'Manager']), staffController.getAllStaff);
router.put('/staff/:id', authMiddleware(['Admin', 'Manager']), staffController.updateStaff);
router.get('/department', authMiddleware(['Admin', 'Manager']), staffController.getStaffByDepartment);
router.get('/name', authMiddleware(['Admin', 'Manager']), staffController.getStaffByName);
router.get('/staff/:doctor_id/job-history', authMiddleware(['Admin', 'Manager']), staffController.getJobHistory);

// Routes exclusive to Admin
router.delete('/staff/:id', authMiddleware(['Admin']), staffController.deleteStaff);
router.get('/payment-report', authMiddleware(['Admin']), staffController.getPaymentReport);


// Routes for viewing doctor's schedules and workloads (Admin and Manager)
router.get('/doctor-schedules', authMiddleware(['Admin', 'Manager']), staffController.getDoctorSchedules);
router.get('/doctor-workload/:doctor_id', authMiddleware(['Admin', 'Manager']), staffController.getDoctorWorkload);
router.get('/all-doctors-workload', authMiddleware(['Admin', 'Manager']), staffController.getAllDoctorsWorkload);
router.get('/:doctor_id/job-history', authMiddleware(['Admin', 'Manager']), staffController.getJobHistory);
router.get('/doctor-performance', authMiddleware(['Admin', 'Manager']), staffController.getDoctorPerformanceRating);
router.get('/:doctor_id', authMiddleware(['Admin', 'Manager']), staffController.getDoctorDetails);
router.get('/doctor/:doctor_id', authMiddleware(['Admin', 'Manager']), staffController.getDoctorDetails);



// Routes for viewing patient treatment history (Admin and Manager)
router.get('/patient/:patient_id/treatment-history', authMiddleware(['Admin', 'Manager']), staffController.getPatientTreatmentHistory);

router.get('/patient/search', authMiddleware(['Admin', 'Manager']), staffController.searchPatientByNameOrID);



module.exports = router;
