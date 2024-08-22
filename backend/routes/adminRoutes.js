const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to get all staff
router.get("/staff", authMiddleware(['admin']), adminController.getAllStaff);

// Route to add a new doctor
router.post("/add-doctor", authMiddleware(["admin"]), adminController.addDoctor);
router.get('/departments', authMiddleware(['admin']), adminController.getAllDepartments);

// Additional routes for filtering, updating, etc.
router.get("/staff-by-department",authMiddleware(['admin']), adminController.getStaffByDepartment);
router.get("/staff-by-name",authMiddleware(['admin']), adminController.getStaffByName);
router.put("/update-staff/:id",authMiddleware(['admin']), adminController.updateStaff);
router.delete("/delete-staff/:id", authMiddleware(['admin']), adminController.deleteStaff);

// router.get("/staff-schedule/:id",authMiddleware(['admin']), adminController.getStaffSchedule);
// router.post("/add-custom-object",authMiddleware(['admin']), adminController.addCustomObject);

module.exports = router;
