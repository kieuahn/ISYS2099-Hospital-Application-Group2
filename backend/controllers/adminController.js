const mysql = require("../config/db");
const mongoClient = require("../config/mongoDb");
const bcrypt = require("bcryptjs");

// Get all staff
exports.getAllStaff = async (req, res) => {
    try {
        const [staff] = await mysql.promise().query("SELECT * FROM StaffDetails");
        res.json(staff);
    } catch (error) {
        console.error("Error fetching staff details:", error.message);
        res.status(500).json({ message: "Failed to retrieve staff details.", error: error.message });
    }
};

// Add a new staff for manager
exports.addStaff = async (req, res) => {
    const { name, email, department_id, qualification, salary, job_type } = req.body;
    const manager_id = req.user.user_id; // Manager/Admin ID from token after authentication

    // Check if all necessary fields are provided
    if (!name || !email || !department_id || !qualification || !salary || !job_type) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if email already exists (optional, for better error handling)
        const [existingStaff] = await mysql.promise().query(
            "SELECT * FROM staff_credentials WHERE email = ?",
            [email]
        );

        if (existingStaff.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Log the values to make sure they are being passed correctly
        console.log("Values being passed to AddStaff procedure: ", {
            name, email, department_id, qualification, salary, job_type, manager_id
        });

        // Hash the password dynamically or generate one
        const hashedPassword = await bcrypt.hash("password1234", 10); // Change this if necessary

        // Call the stored procedure to add the staff
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
        // Improved error handling
        console.error("Error adding staff:", error.message);
        if (error.message.includes("Managers can only add Doctors")) {
            return res.status(403).json({ message: "Managers are only allowed to add doctors." });
        }
        return res.status(500).json({ message: "Failed to add staff.", error: error.message });
    }
};
// View staff by department (Admin can view all, Manager can view supervised)
exports.getStaffByDepartment = async (req, res) => {
    const { department_id } = req.query;  // Get department ID from query
    const role = req.user.role;  // Get user role from the token
    const manager_id = req.user.user_id;  // Get manager ID from the token

    try {
        let query;
        let params;

        if (role === 'Admin') {
            // Admin can view all staff in the department
            query = `SELECT * FROM StaffByDepartment WHERE department_id = ?`;
            params = [department_id];
        } else if (role === 'Manager') {
            // Manager can view only staff they supervise
            query = `SELECT * FROM StaffByDepartment WHERE department_id = ? AND manager_id = ?`;
            params = [department_id, manager_id];
        } else {
            return res.status(403).json({ message: "You do not have permission to view staff by department." });
        }

        const [staff] = await mysql.promise().query(query, params);

        if (staff.length === 0) {
            return res.status(404).json({ message: "No staff found in this department." });
        }

        res.json(staff);
    } catch (error) {
        console.error("Error fetching staff by department:", error.message);
        res.status(500).json({ message: "Failed to fetch staff by department.", error: error.message });
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
    const { id } = req.params; // Staff ID
    const { name, department_id, qualification, salary, job_type } = req.body;
    const user_role = req.user.role; 
    const user_id = req.user.user_id; 

    try {
        const query = `
            CALL UpdateStaffInfo(?, ?, ?, ?, ?, ?, ?, ?);
        `;

        await mysql.promise().query(query, [
            user_role,
            user_id,
            id,
            name,
            department_id,
            qualification,
            salary,
            job_type
        ]);

        res.status(200).json({ message: "Staff information updated successfully." });
    } catch (error) {
        console.error("Error updating staff information:", error.message);
        res.status(500).json({ message: "Failed to update staff information.", error: error.message });
    }
};


// Delete a staff member
exports.deleteStaff = async (req, res) => {
    const { id } = req.params;  // Staff ID from request params

    try {
        // Call the MySQL procedure to delete the staff member
        await mysql.promise().query(`CALL DeleteStaffByAdmin(?)`, [id]);

        res.status(200).json({ message: `Staff with ID ${id} deleted successfully.` });
    } catch (error) {
        console.error("Error deleting staff:", error.message);
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

// View Doctor's Schedules for a Given Duration (Admin and Manager)
exports.getDoctorSchedules = async (req, res) => {
    const user_id = req.user.user_id;  // Manager/Admin ID from token
    const role = req.user.role;  // Role from token (Admin/Manager)
    const { start_date, end_date } = req.query;

    try {
        const [schedules] = await mysql.promise().query(
            "CALL GetDoctorSchedules(?, ?, ?, ?)", 
            [role, user_id, start_date, end_date]
        );
        
        // Check if schedules exist
        if (schedules.length === 0) {
            return res.status(404).json({ message: "No schedules found for this period." });
        }
        
        res.json(schedules);
    } catch (error) {
        console.error("Error fetching doctor schedules:", error.message);
        res.status(500).json({ message: "Failed to retrieve doctor schedules.", error: error.message });
    }
};

// View workload of all doctors for both Admin and Manager
exports.getAllDoctorsWorkload = async (req, res) => {
    const { start_date, end_date } = req.query;
    const user_id = req.user.user_id; // Admin or Manager ID from token
    const role = req.user.role; // 'Admin' or 'Manager' from token

    try {
        const [workload] = await mysql.promise().query(
            `CALL GetAllDoctorsWorkload(?, ?, ?, ?)`,
            [role, user_id, start_date, end_date]
        );

        // Check if the result is empty
        if (workload.length === 0) {
            return res.status(404).json({ message: "No workload found in the specified duration." });
        }

        res.json(workload);
    } catch (error) {
        console.error("Error retrieving all doctors' workloads:", error.message);
        res.status(500).json({ message: "Failed to retrieve all doctors' workloads.", error: error.message });
    }
};

// View workload of a specific doctor for both Admin and Manager
exports.getDoctorWorkload = async (req, res) => {
    const { doctor_id } = req.params;
    const { start_date, end_date } = req.query;
    const user_id = req.user.user_id; // Admin or Manager ID from token
    const role = req.user.role; // 'Admin' or 'Manager' from token

    try {
        const [workload] = await mysql.promise().query(
            `CALL GetDoctorWorkload(?, ?, ?, ?, ?)`,
            [role, user_id, doctor_id, start_date, end_date]
        );

        // Check if the stored procedure returns 'not_supervised'
        if (workload[0] && workload[0][0].error_message === 'not_supervised') {
            return res.status(403).json({ message: "You do not supervise this doctor." });
        }

        // Check if the stored procedure returns 'no_workload'
        if (workload[0] && workload[0][0].error_message === 'no_workload') {
            return res.status(200).json({ message: "The doctor has no workload during this period." });
        }

        // If workload is found, return the data
        if (workload.length > 0) {
            return res.json(workload[0]);
        }

        return res.status(500).json({ message: "Unexpected error occurred." });
    } catch (error) {
        console.error("Error retrieving doctor's workload:", error.message);
        res.status(500).json({ message: "Failed to retrieve doctor's workload.", error: error.message });
    }
};
//view Job history
exports.getJobHistory = async (req, res) => {
    const { staff_id } = req.params; // Staff ID from request params
    const user_role = req.user.role; // Get user role from token (Admin or Manager)
    const user_id = req.user.user_id; // Get user ID (admin or manager)

    try {
        // Call the stored procedure with the appropriate parameters
        const [history] = await mysql.promise().query(
            `CALL GetJobHistory(?, ?, ?)`,
            [user_role, user_id, staff_id]
        );

        // Check if any job history was found
        if (history.length === 0) {
            return res.status(404).json({ message: "No job history found for this staff member." });
        }

        res.json(history[0]); // Return the job history
    } catch (error) {
        console.error("Error fetching job history:", error.message);
        res.status(500).json({ message: "Failed to retrieve job history.", error: error.message });
    }
};

exports.searchPatient = async (req, res) => {
    const search_value = req.query.q; // 'q' is the query parameter (name or ID)

    try {
        // Call the stored procedure
        const [patients] = await mysql.promise().query(
            `CALL SearchPatientByNameOrID(?)`,
            [search_value]
        );

        // Check if any patients were found
        if (patients.length === 0) {
            return res.status(404).json({ message: "No patients found with the given name or ID." });
        }

        res.json(patients[0]);
    } catch (error) {
        console.error("Error searching for patients:", error.message);
        res.status(500).json({ message: "Failed to search for patients.", error: error.message });
    }
};

// View a specific patient's treatment history or all patients' treatment history
exports.getPatientTreatmentHistory = async (req, res) => {
    const { patient_id } = req.params;  // Extract patient ID from the route parameter (0 for all patients)
    const { start_date, end_date } = req.query;  // Extract the start and end date from query parameters
    const user_role = req.user.role;  // Get the user role from token (Admin or Manager)
    const user_id = req.user.user_id;  // Get manager or admin ID from token

    try {
        // Call the stored procedure with role-based logic
        const [treatmentHistory] = await mysql.promise().query(
            `CALL GetPatientTreatmentHistory(?, ?, ?, ?, ?)`,
            [user_role, user_id, patient_id || 0, start_date, end_date]
        );

        // Check if any treatments were found
        if (treatmentHistory.length === 0) {
            return res.status(404).json({ message: "No treatment history found within the specified duration." });
        }

        res.json(treatmentHistory[0]);  // Return the treatment history
    } catch (error) {
        console.error("Error fetching treatment history:", error.message);
        res.status(500).json({ message: "Failed to fetch treatment history.", error: error.message });
    }
};


