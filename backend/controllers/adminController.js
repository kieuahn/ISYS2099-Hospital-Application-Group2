const mysql = require("../config/db");
const mongoClient = require("../config/mongoDb");
const bcrypt = require("bcryptjs");

// Get all staff
exports.getAllStaff = async (req, res) => {
  try {
    const [rows] = await mysql.promise().query("SELECT * FROM staffs");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ message: "Failed to retrieve staff." });
  }
};

// Add a new doctor
exports.addDoctor = async (req, res) => {
  const { name, email, department_id, qualification, salary, role } = req.body;

  try {
    // Start the transaction
    await mysql.promise().beginTransaction();

    // Check if the email already exists in staff_credentials
    const [existingStaff] = await mysql
      .promise()
      .query("SELECT * FROM staff_credentials WHERE email = ?", [email]);

    if (existingStaff.length > 0) {
      await mysql.promise().rollback();
      return res.status(400).json({ message: "Email already exists." });
    }

    // Insert into the `staffs` table first
    const [staffResult] = await mysql.promise().query(
      "INSERT INTO staffs (staff_name, department_id, qualification, salary, job_type) VALUES (?, ?, ?, ?, ?)",
      [name, department_id, qualification, salary, role]
    );

    const staff_id = staffResult.insertId;

    // Then insert into the `staff_credentials` table using the staff_id
    const hashedPassword = await bcrypt.hash("password123", 10);
    await mysql.promise().query(
      "INSERT INTO staff_credentials (staff_id, email, password, role) VALUES (?, ?, ?, ?)",
      [staff_id, email, hashedPassword, role]
    );

    // Commit the transaction
    await mysql.promise().commit();
    res.status(201).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} added successfully.` });
  } catch (error) {
    console.error("Error adding doctor:", error.message);
    await mysql.promise().rollback();
    res.status(500).json({ message: "Failed to add staff.", error: error.message });
  }
};

// Filter staff by department
exports.getStaffByDepartment = async (req, res) => {
  const { department_id } = req.query;
  try {
    const [rows] = await mysql.promise().query("SELECT * FROM staffs WHERE department_id = ?", [department_id]);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching staff by department:", error);
    res.status(500).json({ message: "Failed to retrieve staff by department." });
  }
};

// Filter staff by name
exports.getStaffByName = async (req, res) => {
  const { order = 'ASC' } = req.query;
  try {
    const [rows] = await mysql.promise().query(`SELECT * FROM staffs ORDER BY staff_name ${order}`);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching staff by name:", error);
    res.status(500).json({ message: "Failed to retrieve staff by name." });
  }
};

// Update staff information
exports.updateStaff = async (req, res) => {
  const { id } = req.params;
  const { name, department_id, qualification, salary, role } = req.body;

  try {
    // Begin transaction
    await mysql.promise().query('START TRANSACTION');

    // Update the staff's information in the `staffs` table
    await mysql.promise().query(
      "UPDATE staffs SET staff_name = ?, department_id = ?, qualification = ?, salary = ?, job_type = ? WHERE staff_id = ?",
      [name, department_id, qualification, salary, role, id]
    );

    // Update the role in the `staff_credentials` table
    await mysql.promise().query(
      "UPDATE staff_credentials SET role = ? WHERE staff_id = ?",
      [role, id]
    );

    // Commit transaction
    await mysql.promise().query('COMMIT');
    res.json({ message: "Staff updated successfully." });
  } catch (error) {
    // Rollback transaction in case of error
    await mysql.promise().query('ROLLBACK');
    console.error("Error updating staff:", error.message);
    res.status(500).json({ message: "Failed to update staff information." });
  }
};

// Delete staff by ID
// Delete a staff member
exports.deleteStaff = async (req, res) => {
    const { id } = req.params;

    try {
        // Start transaction
        await mysql.promise().query("START TRANSACTION");

        // Delete from the staff_credentials table
        const [staffCredResult] = await mysql.promise().query("DELETE FROM staff_credentials WHERE staff_id = ?", [id]);

        if (staffCredResult.affectedRows === 0) {
            throw new Error('Staff credentials not found');
        }

        // Delete from the staffs table
        const [staffResult] = await mysql.promise().query("DELETE FROM staffs WHERE staff_id = ?", [id]);

        if (staffResult.affectedRows === 0) {
            throw new Error('Staff not found');
        }

        // Commit the transaction
        await mysql.promise().query("COMMIT");

        res.json({ message: "Staff deleted successfully." });
    } catch (error) {
        // Rollback the transaction in case of error
        await mysql.promise().query("ROLLBACK");
        res.status(500).json({ message: "Failed to delete staff.", error: error.message });
    }
};
//Get all deparments name
exports.getAllDepartments = async (req, res) => {
    try {
        const [departments] = await mysql.promise().query("SELECT * FROM departments");
        res.json(departments);
    } catch (error) {
        console.error("Error fetching departments:", error);
        res.status(500).json({ message: "Failed to fetch departments." });
    }
};


