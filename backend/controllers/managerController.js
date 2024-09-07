const mysql = require("../config/db");

// Get all staff under supervised
exports.listSupervisedStaff = async (req, res) => {
    const manager_id = req.user.user_id; // Assuming the manager's ID is in the token

    try {
        const [staff] = await mysql.promise().query(
            "SELECT * FROM StaffDetails WHERE manager_id = ?",
            [manager_id]
        );
        
        if (staff.length === 0) {
            return res.status(404).json({ message: "No staff found under your supervision." });
        }

        res.json(staff);
    } catch (error) {
        console.error("Error fetching supervised staff:", error.message);
        res.status(500).json({ message: "Failed to retrieve supervised staff.", error: error.message });
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

//Filter staff by name (ASD and DESC)
exports.getStaffByName = async (req, res) => {
  const {order = "ASC"} = req.query;
  const manager_id = req.user.user_id;

  try {
    const [rows] = await mysql.promise().query(
      `SELECT * FROM staff WHERE manager_id = ? ORDER BY staff_name ${order}`,
      [manager_id]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching staff by name!", error.message);
    res.status(500).json({message: "Failed to retrieve staff by name", error: error.message})
  }
}
//Update staff info
// exports.updateStaff = async (req, res) => {
//   const { id } = req.params; // The ID of the staff member to update
//   const { name, department_id, qualification, salary, job_type } = req.body;
//   const manager_id = req.user.user_id; // The manager making the request

//   try {
//     const query = `
//       CALL UpdateStaffInfo(?, ?, ?, ?, ?, ?, ?);
//     `;
    
//     await mysql.promise().query(query, [
//       id, name, department_id, qualification, salary, job_type, manager_id
//     ]);

//     res.json({ message: "Staff information updated successfully." });
//   } catch (error) {
//     console.error("Error updating staff information:", error.message);
//     res.status(500).json({ message: "Failed to update staff information.", error: error.message });
//   }
// };

// View Doctor's Schedules for a Given Duration 
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


//Get job history of a staff
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


// Search patient by name or ID
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


