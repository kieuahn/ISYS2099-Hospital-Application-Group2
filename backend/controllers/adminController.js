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
// exports.addDoctor = async (req, res) => {
//   const { name, email, department_id, qualification, salary } = req.body;
//   let connection;

//   try {
//     connection = await mysql.promise().getConnection();
//     await connection.beginTransaction();

//     const [existingStaff] = await connection.query("SELECT * FROM staff_credentials WHERE email = ?", [email]);

//     if (existingStaff.length > 0) {
//       await connection.rollback();
//       return res.status(400).json({ message: "Email already exists." });
//     }

//     const hashedPassword = await bcrypt.hash("password123", 10);

//     const [result] = await connection.query(
//       "INSERT INTO staff_credentials (email, password, role) VALUES (?, ?, 'doctor')",
//       [email, hashedPassword]
//     );

//     const staff_id = result.insertId;

//     await connection.query(
//       "INSERT INTO staffs (staff_id, staff_name, department_id, qualification, salary, job_type) VALUES (?, ?, ?, ?, ?, 'doctor')",
//       [staff_id, name, department_id, qualification, salary]
//     );

//     await connection.commit();
//     res.status(201).json({ message: "Doctor added successfully." });
//   } catch (error) {
//     console.error("Error adding doctor:", error.message);
//     if (connection) await connection.rollback();
//     res.status(500).json({ message: "Failed to add doctor.", error: error.message });
//   } finally {
//     if (connection) connection.release();
//   }
// };

exports.addDoctor = async (req, res) => {
  const { name, email, department_id, qualification, salary } = req.body;

  try {
    // Start the transaction
    await mysql.promise().beginTransaction();

    const [existingStaff] = await mysql
      .promise()
      .query("SELECT * FROM staff_credentials WHERE email = ?", [email]);

    if (existingStaff.length > 0) {
      await mysql.promise().rollback();
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash("password123", 10);

    const [result] = await mysql.promise().query(
      "INSERT INTO staff_credentials (email, password, role) VALUES (?, ?, 'doctor')",
      [email, hashedPassword]
    );

    const staff_id = result.insertId;

    await mysql.promise().query(
      "INSERT INTO staffs (staff_id, staff_name, department_id, qualification, salary, job_type) VALUES (?, ?, ?, ?, ?, 'doctor')",
      [staff_id, name, department_id, qualification, salary]
    );

    // Commit the transaction
    await mysql.promise().commit();
    res.status(201).json({ message: "Doctor added successfully." });
  } catch (error) {
    console.error("Error adding doctor:", error.message);
    await mysql.promise().rollback();
    res.status(500).json({ message: "Failed to add doctor.", error: error.message });
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

    // Delete from the staffs table
    await mysql.promise().query("DELETE FROM staffs WHERE staff_id = ?", [id]);

    // Delete from the staff_credentials table
    await mysql.promise().query("DELETE FROM staff_credentials WHERE staff_id = ?", [id]);

    // Commit the transaction
    await mysql.promise().query("COMMIT");

    res.json({ message: "Staff deleted successfully." });
  } catch (error) {
    // Rollback the transaction in case of error
    await mysql.promise().query("ROLLBACK");
    res.status(500).json({ message: "Failed to delete staff.", error: error.message });
  }
};
