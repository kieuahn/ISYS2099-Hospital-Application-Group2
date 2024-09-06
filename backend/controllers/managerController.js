const mysql = require("../config/db");

// Get all staff under supervised
exports.listSupervisedStaff = async (req, res) => {
    const manager_id = req.user.user_id;

    try {
        const [rows] = await mysql.promise().query(
            "SELECT * FROM staff WHERE manager_id = ?",
            [manager_id]
        );

        res.status(200).json(rows);
    } catch (error) {
        console.error("Error listing all staff:", error.message);
        res.status(500).json({message: "Failed to list all staff!"});
        
    }
};

//Filter staff by department
exports.getStaffByDepartment = async (req, res) => {
  const manager_id = req.user.user_id; 
  const department_id = req.query.department_id;

  try {
    // Query to select staff supervised by the manager and in the specified department
    const [rows] = await mysql.promise().query(
      `SELECT s.staff_id, s.staff_name, s.department_id, s.job_type 
       FROM staff s
       WHERE s.department_id = ? AND s.manager_id = ?`,
      [department_id, manager_id]
    );

    res.status(200).json(rows);
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
exports.updateStaff = async (req, res) => {
  const { id } = req.params; // The ID of the staff member to update
  const { name, department_id, qualification, salary, job_type } = req.body;
  const manager_id = req.user.user_id; 

  try {
    // Ensure the staff member is supervised by the manager making the request
    const [staff] = await mysql.promise().query(
      "SELECT * FROM staff WHERE staff_id = ? AND manager_id = ?",
      [id, manager_id]
    );

    if (staff.length === 0) {
      return res.status(403).json({ message: "You do not have permission to update this staff member." });
    }

    // Update the staff member's information
    await mysql.promise().query(
      "UPDATE staff SET staff_name = ?, department_id = ?, qualification = ?, salary = ?, job_type = ? WHERE staff_id = ?",
      [name, department_id, qualification, salary, job_type, id]
    );

    res.json({ message: "Staff information updated successfully." });
  } catch (error) {
    console.error("Error updating staff information:", error.message);
    res.status(500).json({ message: "Failed to update staff information.", error: error.message });
  }
};

//View Doctoc's Schedules for a Given Duration
exports.getDoctorSchedules = async (req, res) => {
    const manager_id = req.user.user_id; // Assuming the manager's ID is in the token
    const { start_date, end_date } = req.query;

    try {
        const [schedules] = await mysql.promise().query(
            "CALL GetDoctorSchedulesByManager(?, ?, ?)", 
            [manager_id, start_date, end_date]
        );
        
        // Check if the schedules array is empty
        if (schedules.length === 0) {
            return res.status(403).json({ message: "Error: You do not supervise any doctor with schedules!" });
        }
        res.json(schedules[0]); // Return the schedules to the client
    } catch (error) {
        console.error("Error fetching doctor schedules:", error.message);
        res.status(500).json({ message: "Failed to retrieve doctor schedules.", error: error.message });
    }
};

// View workload of a specific doctor supervised by the manager
exports.getDoctorWorkload = async (req, res) => {
  const { doctor_id } = req.params;
  const { start_date, end_date } = req.query;
  const manager_id = req.user.user_id; // Manager ID from token

  try {
      const [workload] = await mysql.promise().query(
          `CALL GetDoctorWorkloadByManager(?, ?, ?, ?)`,
          [manager_id, doctor_id, start_date, end_date]
      );

      // Debugging: Log the returned workload to inspect it
      console.log("Workload result:", workload);
      
      
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

      // Fallback to ensure that empty results are handled
      return res.status(500).json({ message: "Unexpected error occurred." });
  } catch (error) {
      console.error("Error retrieving doctor's workload:", error.message);
      res.status(500).json({ message: "Failed to retrieve doctor's workload", error: error.message });
  }
};

//View Doctocs's Workload of a doctor in given duration
exports.getAllDoctorsWorkload = async (req, res) => {
    const { start_date, end_date } = req.query;
    const manager_id = req.user.user_id; // Manager ID from token

    try {
        const [workload] = await mysql.promise().query(
            `CALL GetAllDoctorsWorkloadByManager(?, ?, ?)`,
            [manager_id, start_date, end_date]
        );

        // Check if the workload array is empty, meaning no result found
        if (workload.length === 0) {
            return res.status(403).json({ message: "Error: You do not supervise this doctor or no workload found in this duration." });
        }

        res.json(workload[0]);
    } catch (error) {
        console.error("Error retrieving all doctors' workloads:", error.message);
        res.status(500).json({ message: "Failed to retrieve all doctors' workloads", error: error.message });
    }
};

//Get job history of a staff
exports.getStaffJobHistory = async (req, res) => {
  const { doctor_id } = req.params;
  const manager_id = req.user.user_id; // Manager ID from token

  try {
    const[history] = await mysql.promise().query(`
      CALL GetJobHistoryByManager(?, ?)`,
      [doctor_id, manager_id]
    );

    if(history.length === 0) {
      return res.status(404).json({message: "No job his tory found or staff not under this manager"})
    }
    
    res.json(history);
  } catch (error) {
    console.error("Error fetching job history!", error);
    res.status(500).json({ message: "Failed to fetch job history", error: error.message});
  }
};