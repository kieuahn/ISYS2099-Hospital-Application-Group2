/**
 * Procedure to add a new staff member to the system.
 *
 * This procedure checks the role of the manager/admin performing the operation
 * and restricts the job type accordingly. Managers can only add Doctors.
 *
 * @param p_staff_name VARCHAR(50) - The name of the staff member
 * @param p_email VARCHAR(100) - The email address of the staff member
 * @param p_password VARCHAR(255) - The password for the staff member
 * @param p_department_id VARCHAR(6) - The department ID of the staff member
 * @param p_qualification VARCHAR(50) - The qualification of the staff member
 * @param p_salary DECIMAL(10,2) - The salary of the staff member
 * @param p_job_type ENUM('Doctor', 'Manager', 'Admin') - The job type of the staff member
 * @param p_manager_id INT - The ID of the manager/admin performing the operation
 *
 * Example:
 * CALL AddStaff('John Doe', 'johndoe@example.com', 'password123', 'DEPT001', 'MBBS', 50000.00, 'Doctor', 1);
 */
DROP PROCEDURE IF EXISTS AddStaff;
DROP PROCEDURE IF EXISTS GetDoctorSchedulesByManager;
DROP PROCEDURE IF EXISTS GetAllDoctorsWorkloadByManager;
DROP PROCEDURE IF EXISTS GetJobHistoryByManager;
DROP PROCEDURE IF EXISTS GetDoctorSchedulesByManager;


DELIMITER //

CREATE PROCEDURE AddStaff (
    IN p_staff_name VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255),
    IN p_department_id VARCHAR(6),
    IN p_qualification VARCHAR(50),
    IN p_salary DECIMAL(10,2),
    IN p_job_type ENUM('Doctor', 'Manager', 'Admin'),
    IN p_manager_id INT
)
BEGIN
    DECLARE v_user_role ENUM('Admin', 'Manager');

    -- Fetch the role of the manager/admin performing the operation
    SELECT job_type INTO v_user_role FROM staff_credentials WHERE staff_id = p_manager_id;

    -- Check if the role is Manager and restrict the job_type
    IF v_user_role = 'Manager' AND p_job_type <> 'Doctor' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Managers can only add Doctors';
    ELSE
        -- Insert into the staff table
        INSERT INTO staff (staff_name, department_id, manager_id, qualification, salary, job_type, start_date)
        VALUES (p_staff_name, p_department_id, p_manager_id, p_qualification, p_salary, p_job_type, NOW());

        -- Insert into the staff_credentials table
        SET @staff_id = LAST_INSERT_ID();
        INSERT INTO staff_credentials (staff_id, email, password, job_type)
        VALUES (@staff_id, p_email, p_password, p_job_type);
    END IF;
END //


DELIMITER ;


DELIMITER //

CREATE PROCEDURE GetDoctorSchedulesByManager(
    IN p_manager_id INT,
    IN p_start_date DATETIME,
    IN p_end_date DATETIME
)
BEGIN
    SELECT 
        ds.schedule_id,
        ds.staff_id,
        s.staff_name,
        ds.shift_start,
        ds.shift_end,
        ds.availability_status
    FROM 
        doctor_schedules ds
        JOIN staff s ON ds.staff_id = s.staff_id
    WHERE 
        s.manager_id = p_manager_id 
        AND ds.shift_start >= p_start_date
        AND ds.shift_end <= p_end_date;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE GetAllDoctorsWorkloadByManager(
    IN p_manager_id INT,
    IN p_start_date DATETIME,
    IN p_end_date DATETIME
)
BEGIN
    SELECT 
        s.staff_id,
        s.staff_name,
        COUNT(a.appointment_id) AS total_appointments,
        SUM(TIMESTAMPDIFF(MINUTE, a.start_time, a.end_time)) AS total_minutes
    FROM 
        appointments a
    INNER JOIN 
        staff s ON a.staff_id = s.staff_id
    WHERE 
        s.manager_id = p_manager_id 
        AND a.start_time BETWEEN p_start_date AND p_end_date
    GROUP BY s.staff_id, s.staff_name;
END //

DELIMITER ;


DELIMITER //

CREATE PROCEDURE GetDoctorWorkloadByManager(
    IN p_manager_id INT,
    IN p_doctor_id INT,
    IN p_start_date DATETIME,
    IN p_end_date DATETIME
)
BEGIN
    SELECT 
        s.staff_id,
        s.staff_name,
        COUNT(a.appointment_id) AS total_appointments,
        SUM(TIMESTAMPDIFF(MINUTE, a.start_time, a.end_time)) AS total_minutes
    FROM 
        appointments a
    INNER JOIN 
        staff s ON a.staff_id = s.staff_id
    WHERE 
        s.manager_id = p_manager_id 
        AND s.staff_id = p_doctor_id
        AND a.start_time BETWEEN p_start_date AND p_end_date
    GROUP BY s.staff_id, s.staff_name;
END //

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE GetJobHistoryByManager(
    IN p_staff_id INT,
    IN p_manager_id INT
)
BEGIN
    SELECT 
        jh.staff_name, 
        jh.department_id, 
        d.department_name, 
        jh.manager_id, 
        s.staff_name AS manager_name, 
        jh.qualification, 
        jh.salary, 
        jh.job_type, 
        jh.updated_at
    FROM 
        job_history jh
    LEFT JOIN 
        departments d ON jh.department_id = d.department_id
    LEFT JOIN 
        staff s ON jh.manager_id = s.staff_id
    WHERE 
        jh.staff_id = p_staff_id 
        AND jh.manager_id = p_manager_id;
END $$

DELIMITER ;


