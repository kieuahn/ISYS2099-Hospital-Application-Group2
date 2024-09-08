

const express = require("express");
const departmentController = require("../controllers/departmentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// get all departments
router.get("/all-departments", authMiddleware(["admin", "manager"]), departmentController.getAllDepartments);

// get all departments by id
router.get("/departments/:id", authMiddleware(["admin", "manager"]), departmentController.getDepartmentById);

//CRUD operations
router.post("/departments", authMiddleware(["admin"]), departmentController.addDepartment);

router.put("/departments/:id", authMiddleware(["admin"]), departmentController.updateDepartment);

router.delete("/departments/:id", authMiddleware(["admin"]), departmentController.deleteDepartment);

module.exports = router;
