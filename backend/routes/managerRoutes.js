const express = require('express');
const router = express.Router();
const managerController = require("../controllers/managerController");
const authMiddleware = require('../middleware/authMiddleware');

router.get("/supervised-staff", authMiddleware(["Manager"]), managerController.listSupervisedStaff);
router.get("/staff-by-department", authMiddleware(["Manager"]), managerController.getStaffByDepartment);
router.get("/staff-by-name", authMiddleware(["Manager"]), managerController.getStaffByName);

router.put("/update-staff/:id", authMiddleware(["Manager"]), managerController.updateStaff);


router.get("/doctor-schedules", authMiddleware(["Manager"]), managerController.getDoctorSchedules);

module.exports = router;
