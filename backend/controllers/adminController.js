const mysql = require("../config/db");
const mongoClient = require("../config/mongoDb");
const bcrypt = require("bcryptjs");

// Get all staff
exports.getAllStaff = async (req, res) => {
  try {
    const [rows] = await mysql.promise().query("SELECT * FROM staff");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ message: "Failed to retrieve staff." });
  }
};

// Add a new doctor
// exports.addDoctor = async (req, res) => {
//   const { name, email, department_id, qualification, salary, job_type } = req.body;
//   const user_role = req.user.role;

//   // Restrict manager from adding any job type other than doctor
//   if (user_role === 'Manager' && job_type !== 'Doctor') {
//     return res.status(403).json({ message: "Managers can only add doctors." });
//   }

//   try {
//     // Start the transaction
//     await mysql.promise().beginTransaction();

//     // Check if the email already exists in staff_credentials
//     const [existingStaff] = await mysql
//       .promise()
//       .query("SELECT * FROM staff_credentials WHERE email = ?", [email]);

//     if (existingStaff.length > 0) {
//       await mysql.promise().rollback();
//       return res.status(400).json({ message: "Email already exists." });
//     }
    

//     // Insert into the `staff` table first
//     const [staffResult] = await mysql.promise().query(
//       "INSERT INTO staff (staff_name, department_id, manager_id, qualification, salary, job_type, start_date) VALUES (?, ?, ?, ?, ?, ? , NOW())",
//       [name, department_id, manager_id, qualification, salary]
//     );

//     const staff_id = staffResult.insertId;

//     // Then insert into the `staff_credentials` table using the staff_id
//     const hashedPassword = await bcrypt.hash("password1234", 10);
//     await mysql.promise().query(
//       "INSERT INTO staff_credentials (staff_id, email, password, job_type) VALUES (?, ?, ?, ?)",
//       [staff_id, email, hashedPassword, job_type]
//     );

//     // Commit the transaction
//     await mysql.promise().commit();
//     res.status(201).json({ message: `${job_type} added successfully.` });
//   } catch (error) {
//     console.error("Error adding doctor:", error.message);
//     await mysql.promise().rollback();
//     res.status(500).json({ message: "Failed to add staff.", error: error.message });
//   }
// };
//Add staff using for admin and manager
exports.addStaff = async (req, res) => {
    const { name, email, department_id, qualification, salary, job_type } = req.body;
    const manager_id = req.user.user_id; // Assuming you attach user info to req.user after authentication

    // console.log("body : ". req.body); //debug
    try {
        const hashedPassword = await bcrypt.hash("password123", 10);

        const query = `
            CALL AddStaff(?, ?, ?, ?, ?, ?, ?, ?);
        `;

        await mysql.promise().query(query, [
            name,
            email,
            hashedPassword,
            department_id,
            qualification,
            salary,
            job_type,
            manager_id
        ]);

        res.status(201).json({ message: `${job_type} added successfully.` });
    } catch (error) {
        console.error("Error adding staff:", error.message);
        res.status(500).json({ message: "Failed to add staff.", error: error.message });
    }
};

// Filter staff by department
exports.getStaffByDepartment = async (req, res) => {
  const { department_id } = req.query;
  try {
    const [rows] = await mysql.promise().query("SELECT * FROM staff WHERE department_id = ?", [department_id]);
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
    const [rows] = await mysql.promise().query(`SELECT * FROM staff ORDER BY staff_name ${order}`);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching staff by name:", error);
    res.status(500).json({ message: "Failed to retrieve staff by name." });
  }
};

// Update staff information
exports.updateStaff = async (req, res) => {
  const { id } = req.params;
  const { name, department_id, qualification, salary, job_type  } = req.body;

  try {
    // Begin transaction
    await mysql.promise().query('START TRANSACTION');

    // Update the staff's information in the `staffs` table
    await mysql.promise().query(
      "UPDATE staff SET staff_name = ?, department_id = ?, qualification = ?, salary = ?, job_type = ? WHERE staff_id = ?",
      [name, department_id, qualification, salary, job_type , id]
    );

    // Update the role in the `staff_credentials` table
    await mysql.promise().query(
      "UPDATE staff_credentials SET job_type = ? WHERE staff_id = ?",
      [job_type , id]
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
        const [staffResult] = await mysql.promise().query("DELETE FROM staff WHERE staff_id = ?", [id]);

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


