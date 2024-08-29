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
        -- Insert into the `staff` table
        INSERT INTO staff (staff_name, department_id, manager_id, qualification, salary, job_type, start_date)
        VALUES (p_staff_name, p_department_id, p_manager_id, p_qualification, p_salary, p_job_type, NOW());

        -- Insert into the `staff_credentials` table
        SET @staff_id = LAST_INSERT_ID();
        INSERT INTO staff_credentials (staff_id, email, password, job_type)
        VALUES (@staff_id, p_email, p_password, p_job_type);
    END IF;
END //

DELIMITER ;


DELIMITER $$
/**
 * Retrieves doctor schedules by manager ID within a specified date range.
 *
 * @param p_manager_id INT: The ID of the manager.
 * @param p_start_date DATETIME: The start date of the schedule period.
 * @param p_end_date DATETIME: The end date of the schedule period.
 *
 * @return A result set containing the schedule ID, staff ID, staff name, shift start and end times, and availability status.
 *
 * Example:
 * CALL GetDoctorSchedulesByManager(1, '2022-01-01 00:00:00', '2022-01-31 23:59:59');
 */
 
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
END$$

DELIMITER ;

