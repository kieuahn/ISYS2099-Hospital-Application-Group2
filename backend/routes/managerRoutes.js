const express = require('express');
const router = express.Router();
const managerController = require("../controllers/managerController");
const authMiddleware = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');


router.post('/add-staff', authMiddleware(['Admin', 'Manager']), adminController.addStaff);

router.get('/supervised-staff', authMiddleware(['Manager']), managerController.listSupervisedStaff);
router.get('/staff-by-department', authMiddleware(['Manager']), managerController.getStaffByDepartment);
router.get("/staff-by-name", authMiddleware(['Manager']), managerController.getStaffByName);
router.put('/staff/:id', authMiddleware(['Admin', 'Manager']), adminController.updateStaff);
router.get("/doctor-schedules", authMiddleware(['Manager']), managerController.getDoctorSchedules);
router.get('/doctor/:doctor_id/workload', authMiddleware(['Manager']), managerController.getDoctorWorkload);
router.get('/doctors/workload', authMiddleware(['Manager']), managerController.getAllDoctorsWorkload);
router.get('/staff/:staff_id/job-history', authMiddleware(['Manager']), managerController.getJobHistory);


router.get('/search-patient', authMiddleware(['Admin', 'Manager']), managerController.searchPatient);

router.get('/patients/:patient_id/treatment-history', authMiddleware(['Manager']), managerController.getPatientTreatmentHistory);
router.get('/patients/treatment-history', authMiddleware(['Manager']), managerController.getPatientTreatmentHistory);


module.exports = router;
