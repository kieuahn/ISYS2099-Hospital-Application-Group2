const mysql = require("../config/db");

//get all departments
exports.getAllDepartments = async (req, res) => {
    try {
        const [rows] = await mysql.promise().query("SELECT * FROM departments")
        res.json(rows);
    } catch (error) {
        console.error("Error fetching departments:", error);
        res.status(500).json({ message: "Failed to fetch departments." });
    }
};

//get department by id
exports.getDepartmentById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await mysql.promise().query("SELECT * FROM departments WHERE department_id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Department not found." });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching department:", error.message);
        res.status(500).json({ message: "Failed to retrieve department." });
    }
};


//add a new department 
exports.addDepartment = async (req, res) => {
    const { department_name } = req.body;

    try {
        const [result] = await mysql.promise().query(
            "INSERT INTO departments (department_name) VALUES (?)",
            [department_name]
        );
        res.status(201).json({ message: "Department added successfully.", department_id: result.insertId });
    } catch (error) {
        console.error("Error adding department:", error.message);
        res.status(500).json({ message: "Failed to add department." });
    }
};


//update department
exports.updateDepartment = async (req, res) => {
    const { id } = req.params;
    const { department_name } = req.params;
    try {
        const [departmentResult] = await mysql.promise().query("UPDATE departments SET department_name = ? WHERE department_id = ?", [department_name, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Department not found." });
        }
        res.json({ message: "Department updated successfully." });
    } catch (error) {
        console.error("Error updating department:", error.message);
        res.status(500).json({ message: "Failed to update department." });
    }
};

//delete department
exports.deleteDepartment = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await mysql.promise().query(
            "DELETE FROM departments WHERE department_id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Department not found." });
        }

        res.json({ message: "Department deleted successfully." });
    } catch (error) {
        console.error("Error deleting department:", error.message);
        res.status(500).json({ message: "Failed to delete department." });
    }
};
