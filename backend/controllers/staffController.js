const {poolShare, poolAdmin} = require("../config/db");

const bcrypt = require("bcryptjs");

// Add a new staff for manager DONE
exports.addStaff = async (req, res) => {
    const { name, email, department_id, qualification, salary, job_type } = req.body;
    const manager_id = req.user.user_id;

    try {
        // Check if email already exists (optional, for better error handling)
        const [existingStaff] = await poolShare.query(
            "SELECT * FROM staff_credentials WHERE email = ?",
            [email]
        );

        if (existingStaff.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash the password dynamically or generate one
        const hashedPassword = await bcrypt.hash("password1234", 10); // Change this if necessary

        // Call the stored procedure to add the staff
        const query = `
            CALL AddStaff(?, ?, ?, ?, ?, ?, ?, ?);
        `;

        await poolShare.query(query, [
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

//Get all staff (Admin sees all, Manager sees only supervised) DONE
exports.getAllStaff = async (req, res) => {
    const role = req.user.role; // 'Admin' or 'Manager'
    const user_id = req.user.user_id; // Manager ID or Admin ID

    try {
        let query;
        let params;

        if (role === 'Admin') {
            query = "SELECT * FROM StaffDetails"; 
            params = [];
        } else if (role === 'Manager') {
            query = "SELECT * FROM StaffDetails WHERE manager_id = ?"; 
            params = [user_id];
        } else {
            return res.status(403).json({ message: "You do not have permission to view staff details." });
        }

        const [staff] = await poolShare.query(query, params);
        res.json(staff);
    } catch (error) {
        console.error("Error fetching staff details:", error.message);
        res.status(500).json({ message: "Failed to retrieve staff details.", error: error.message });
    }
};

// View staff by department
exports.getStaffByDepartment = async (req, res) => {
    const { department_id } = req.query;  // Get department ID from query params
    const { role, user_id } = req.user;  // Get role and user ID from the token

    try {
        let query;
        let params;

        if (role === 'Admin') {
            // Admin can view all staff in the department
            query = `SELECT * FROM StaffByDepartment WHERE department_id = ?`;
            params = [department_id];
        } else if (role === 'Manager') {
            // Manager can only view staff they supervise
            query = `SELECT * FROM StaffByDepartment WHERE department_id = ? AND manager_id = ?`;
            params = [department_id, user_id];
        } else {
            return res.status(403).json({ message: "You do not have permission to view staff by department." });
        }

        const [staff] = await poolShare.query(query, params);

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
    const { order = 'ASC' } = req.query;  // Get sorting order (default to ASC)
    const { role, user_id } = req.user;   // Get role and user ID from token

    try {
        let query = 'SELECT * FROM staff';
        let params = [];

        // If the user is a Manager, restrict them to the staff they supervise
        if (role === 'Manager') {
            query += ' WHERE manager_id = ?';
            params.push(user_id);
        }

        // Add sorting order
        query += ` ORDER BY staff_name ${order}`;

        const [staff] = await poolShare.query(query, params);

        if (staff.length === 0) {
            return res.status(404).json({ message: "No staff found." });
        }

        res.json(staff);
    } catch (error) {
        console.error("Error fetching staff by name:", error.message);
        res.status(500).json({ message: "Failed to retrieve staff by name.", error: error.message });
    }
};

// Update staff information DONE
exports.updateStaff = async (req, res) => {
    const { id } = req.params; // Staff ID
    const { name, department_id, qualification, salary, job_type } = req.body;
    const user_role = req.user.role; 
    const user_id = req.user.user_id; 

    try {
        const query = `
            CALL UpdateStaffInfo(?, ?, ?, ?, ?, ?, ?, ?);
        `;

        await poolShare.query(query, [
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

// Delete a staff member DONE
exports.deleteStaff = async (req, res) => {
    const { id } = req.params;  // Staff ID
    const role = req.user.role;  // Get user role from token

    // Only Admin can delete staff
    if (role !== 'Admin') {
        return res.status(403).json({ message: "Only Admin can delete staff." });
    }

    try {
        await poolAdmin.promise().query(`CALL DeleteStaffByAdmin(?)`, [id]);
        res.status(200).json({ message: `Staff with ID ${id} deleted successfully.` });
    } catch (error) {
        console.error("Error deleting staff:", error.message);
        res.status(500).json({ message: "Failed to delete staff.", error: error.message });
    }
};

//Get all deparments name
exports.getAllDepartments = async (req, res) => {
    try {
        const [departments] = await poolShare.query("SELECT * FROM departments");
        res.json(departments);
    } catch (error) {
        console.error("Error fetching departments:", error);
        res.status(500).json({ message: "Failed to fetch departments." });
    }
};

// View Doctor's Schedules for a Given Duration (Admin and Manager) DONE
exports.getDoctorSchedules = async (req, res) => {
    const user_id = req.user.user_id;  // Manager/Admin ID from token
    const role = req.user.role;  // Role from token (Admin/Manager)
    const { start_date, end_date } = req.query;

    try {
        const [schedules] = await poolShare.query(
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

// View workload of all doctors for both Admin and Manager DONE
exports.getAllDoctorsWorkload = async (req, res) => {
    const { start_date, end_date } = req.query;
    const user_id = req.user.user_id; // Admin or Manager ID from token
    const role = req.user.role; // 'Admin' or 'Manager' from token

    try {
        const [workload] = await poolShare.query(
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

// View workload of a specific doctor for both Admin and Manager DONE
exports.getDoctorWorkload = async (req, res) => {
    const { doctor_id } = req.params;
    const { start_date, end_date } = req.query;
    const user_id = req.user.user_id; // Admin or Manager ID from token
    const role = req.user.role; // 'Admin' or 'Manager' from token

    try {
        const [workload] = await poolShare.query(
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

//view Job history DONE
exports.getJobHistory = async (req, res) => {
    const { doctor_id } = req.params; // Staff ID from request params
    const user_role = req.user.role; // Get user role from token (Admin or Manager)
    const user_id = req.user.user_id; // Get user ID (admin or manager)
    console.log('Doctor ID:', doctor_id); // Log doctor_id to verify it's correct
    try {
        // Call the stored procedure with the appropriate parameters
        const [history] = await poolShare.query(
            `CALL GetJobHistory(?, ?, ?)`,
            [user_role, user_id, doctor_id]
        );

        // Check if any job history was found
        if (history.length === [0][0]) {
            return res.status(404).json({ message: "No job history found for this staff member." });
        }

        res.json(history[0]); // Return the job history
    } catch (error) {
        console.error("Error fetching job history:", error.message);
        res.status(500).json({ message: "Failed to retrieve job history.", error: error.message });
    }
};

//Search patient by name or id
exports.searchPatientByNameOrID = async (req, res) => {
    const { search_value } = req.query; // Get the search value from query params

    try {
        const query = `
            SELECT * FROM PatientDetails 
            WHERE patient_name LIKE CONCAT('%', ?, '%') OR patient_id = ?
        `;
        const [patients] = await poolShare.query(query, [search_value, search_value]);

        if (patients.length === 0) {
            return res.status(404).json({ message: "No patient found." });
        }

        res.json(patients);
    } catch (error) {
        console.error("Error searching for patient:", error.message);
        res.status(500).json({ message: "Failed to search for patient.", error: error.message });
    }
};

// View a specific patient's treatment history or all patients' treatment history DONE
exports.getPatientTreatmentHistory = async (req, res) => {
    const { patient_id } = req.params;  // Extract patient ID from the route parameter (0 for all patients)
    const { start_date, end_date } = req.query;  // Extract the start and end date from query parameters
    const user_role = req.user.role;  // Get the user role from token (Admin or Manager)
    const user_id = req.user.user_id;  // Get manager or admin ID from token

    try {
        // Call the stored procedure with role-based logic
        const [treatmentHistory] = await poolShare.query(
            `CALL GetPatientTreatmentHistory(?, ?, ?, ?, ?)`,
            [user_role, user_id, patient_id || 0, start_date, end_date]
        );

        console.log("result: ", treatmentHistory);
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

