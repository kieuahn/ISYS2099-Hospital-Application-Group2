const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to get all staff
router.get("/staff", authMiddleware(['Admin']), adminController.getAllStaff);

// Route to add a new doctor
router.post('/add-doctor', authMiddleware(['Admin', 'Manager']), adminController.addStaff);
router.get('/departments', authMiddleware(['Admin']), adminController.getAllDepartments);

// Additional routes for filtering, updating, etc.
router.get("/staff-by-department",authMiddleware(['Admin']), adminController.getStaffByDepartment);
router.get("/staff-by-name",authMiddleware(['Admin']), adminController.getStaffByName);
router.put("/update-staff/:id",authMiddleware(['Admin']), adminController.updateStaff);
router.delete("/delete-staff/:id", authMiddleware(['Admin']), adminController.deleteStaff);

// router.get("/staff-schedule/:id",authMiddleware(['admin']), adminController.getStaffSchedule);
// router.post("/add-custom-object",authMiddleware(['admin']), adminController.addCustomObject);

module.exports = router;
