-- Drop existing procedures to avoid conflicts
DROP PROCEDURE IF EXISTS AddStaff;
DROP PROCEDURE IF EXISTS DeleteStaffByAdmin;
DROP PROCEDURE IF EXISTS GetAllDoctorsWorkload;
DROP PROCEDURE IF EXISTS GetDoctorSchedules;
DROP PROCEDURE IF EXISTS GetDoctorWorkload;
DROP PROCEDURE IF EXISTS GetJobHistory;
DROP PROCEDURE IF EXISTS GetPatientTreatmentHistory;
DROP PROCEDURE IF EXISTS UpdateStaffInfo;


DROP FUNCTION IF EXISTS IsDoctorUnderManager;

-- Create function to check if a doctor is supervised by a specific manager
DELIMITER //

CREATE FUNCTION IsDoctorUnderManager(
    p_doctor_id INT,
    p_manager_id INT
) RETURNS BOOLEAN
READS SQL DATA
BEGIN
    DECLARE is_supervised BOOLEAN;

    -- Check if the doctor is supervised by the manager
    SELECT EXISTS (
        SELECT 1
        FROM staff
        WHERE staff_id = p_doctor_id
        AND manager_id = p_manager_id
    ) INTO is_supervised;

    RETURN is_supervised;  -- Return true if the doctor is under the manager's supervision
END //

DELIMITER ;

-- Procedure to add a new staff member with manager restrictions
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

    -- Manager can only add doctors
    IF v_user_role = 'Manager' AND p_job_type <> 'Doctor' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Managers can only add Doctors';
    ELSE
        -- Insert into staff table
        INSERT INTO staff (staff_name, department_id, manager_id, qualification, salary, job_type, start_date)
        VALUES (p_staff_name, p_department_id, p_manager_id, p_qualification, p_salary, p_job_type, NOW());

        -- Insert into staff_credentials table
        SET @staff_id = LAST_INSERT_ID();
        INSERT INTO staff_credentials (staff_id, email, password, job_type)
        VALUES (@staff_id, p_email, p_password, p_job_type);
    END IF;
END //

DELIMITER ;

-- Procedure to update staff information
DELIMITER //

CREATE PROCEDURE UpdateStaffInfo(
    IN p_user_role ENUM('Admin', 'Manager'),
    IN p_user_id INT, -- Admin or Manager ID
    IN p_staff_id INT, -- Staff ID to update
    IN p_staff_name VARCHAR(50),
    IN p_department_id VARCHAR(6),
    IN p_qualification VARCHAR(50),
    IN p_salary DECIMAL(10,2),
    IN p_job_type ENUM('Doctor', 'Manager', 'Admin')
)
BEGIN
    -- Declare the authorized variable at the start of the procedure
    DECLARE authorized BOOLEAN;

    -- Admin can update any staff
    IF p_user_role = 'Admin' THEN
        UPDATE staff
        SET staff_name = p_staff_name,
            department_id = p_department_id,
            qualification = p_qualification,
            salary = p_salary,
            job_type = p_job_type
        WHERE staff_id = p_staff_id;
    ELSE
        -- Check if the manager is authorized to update the doctor
        SET authorized = IsDoctorUnderManager(p_staff_id, p_user_id);

        -- Check authorization result
        IF authorized THEN
            -- If authorized, proceed with the update
            UPDATE staff
            SET staff_name = p_staff_name,
                department_id = p_department_id,
                qualification = p_qualification,
                salary = p_salary,
                job_type = p_job_type
            WHERE staff_id = p_staff_id;
        ELSE
            -- If not authorized, return an error
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Not authorized to update this staff member';
        END IF;
    END IF;
END //

DELIMITER ;

-- Procedure to delete a staff member by Admin
DELIMITER //

CREATE PROCEDURE DeleteStaffByAdmin(
    IN p_staff_id INT
)
BEGIN
    START TRANSACTION;
    
    -- Delete from staff_credentials table first
    DELETE FROM staff_credentials WHERE staff_id = p_staff_id;

    -- Then delete from the staff table
    DELETE FROM staff WHERE staff_id = p_staff_id;

    COMMIT;
END //

DELIMITER ;

-- Procedure to get doctor schedules based on user role
DELIMITER //

CREATE PROCEDURE GetDoctorSchedules(
    IN p_user_role ENUM('Admin', 'Manager'),
    IN p_user_id INT,
    IN p_start_date DATETIME,
    IN p_end_date DATETIME
)
BEGIN
    IF p_user_role = 'Admin' THEN
        -- Admin can view all doctor schedules
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
            ds.shift_start >= p_start_date
            AND ds.shift_end <= p_end_date;
    ELSE
        -- Manager can only view schedules of doctors they supervise
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
            s.manager_id = p_user_id 
            AND ds.shift_start >= p_start_date
            AND ds.shift_end <= p_end_date;
    END IF;
END //

DELIMITER ;

-- Procedure to get the workload of all doctors based on user role
DELIMITER //

CREATE PROCEDURE GetAllDoctorsWorkload(
    IN p_user_role ENUM('Admin', 'Manager'),
    IN p_user_id INT,  -- admin or manager ID
    IN p_start_date DATETIME,
    IN p_end_date DATETIME
)
BEGIN
    IF p_user_role = 'Admin' THEN
        -- Admin: Return workload for all doctors
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
            a.start_time BETWEEN p_start_date AND p_end_date
        GROUP BY s.staff_id, s.staff_name;
    ELSE
        -- Manager: Return workload only for doctors they supervise
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
            s.manager_id = p_user_id 
            AND a.start_time BETWEEN p_start_date AND p_end_date
        GROUP BY s.staff_id, s.staff_name;
    END IF;
END //

DELIMITER ;

-- Procedure to get workload of a specific doctor
DELIMITER //

CREATE PROCEDURE GetDoctorWorkload(
    IN p_user_role ENUM('Admin', 'Manager'),
    IN p_user_id INT,  -- admin or manager ID
    IN p_doctor_id INT, -- doctor ID
    IN p_start_date DATETIME,
    IN p_end_date DATETIME
)
BEGIN
    IF p_user_role = 'Admin' THEN
        -- Admin: Can view any doctor's workload
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
            s.staff_id = p_doctor_id
            AND a.start_time BETWEEN p_start_date AND p_end_date
        GROUP BY s.staff_id, s.staff_name;
    ELSE
        -- Manager: Can only view doctors under their supervision
        IF IsDoctorUnderManager(p_doctor_id, p_user_id) THEN
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
                s.staff_id = p_doctor_id
                AND a.start_time BETWEEN p_start_date AND p_end_date
            GROUP BY s.staff_id, s.staff_name;
        ELSE
            -- Error if the manager does not supervise the doctor
            SELECT 'not_supervised' AS error_message;
        END IF;
    END IF;
END //

DELIMITER ;

-- Procedure to get job history of staff based on user role

DELIMITER //

CREATE PROCEDURE GetJobHistory(
    IN p_user_role ENUM('Admin', 'Manager'),
    IN p_user_id INT, -- Admin or Manager ID
    IN p_staff_id INT -- Staff ID whose job history is being viewed
)
BEGIN
    -- Admin: Can view job history of any staff
    IF p_user_role = 'Admin' THEN
        -- Fetch job history for Admin
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
            jh.staff_id = p_staff_id;  -- Filter by staff ID

    ELSE
        -- Manager: Can view job history only for doctors under their supervision
        IF IsDoctorUnderManager(p_staff_id, p_user_id) THEN
            -- Fetch job history for Manager
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
                jh.staff_id = p_staff_id;  -- Filter by staff ID
        ELSE
            -- Return an error if the manager does not supervise the staff
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'You do not supervise this staff member.';
        END IF;
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE GetPatientTreatmentHistory(
    IN p_user_role ENUM('Admin', 'Manager'),
    IN p_user_id INT, -- manager or admin ID
    IN p_patient_id INT,
    IN p_start_date DATETIME,
    IN p_end_date DATETIME
)
BEGIN
    IF p_user_role = 'Admin' THEN
        -- Admin: Return all treatment history
        SELECT 
            p.patient_name,
            t.treatment_id,
            t.diagnosis,
            t.treatment_procedure,
            t.medication,
            t.instruction,
            t.treatment_date,
            a.purpose AS appointment_purpose,
            a.start_time AS appointment_start,
            a.end_time AS appointment_end,
            s.staff_name AS doctor_name
        FROM 
            treatments t
        JOIN 
            appointments a ON t.appointment_id = a.appointment_id
        JOIN 
            staff s ON a.staff_id = s.staff_id
        JOIN 
            patients p ON t.patient_id = p.patient_id
        WHERE 
            t.patient_id = p_patient_id 
            AND a.start_time BETWEEN p_start_date AND p_end_date;
    ELSE
        -- Manager: Return only treatments under doctors they supervise
        SELECT 
            p.patient_name,
            t.treatment_id,
            t.diagnosis,
            t.treatment_procedure,
            t.medication,
            t.instruction,
            t.treatment_date,
            a.purpose AS appointment_purpose,
            a.start_time AS appointment_start,
            a.end_time AS appointment_end,
            s.staff_name AS doctor_name
        FROM 
            treatments t
        JOIN 
            appointments a ON t.appointment_id = a.appointment_id
        JOIN 
            staff s ON a.staff_id = s.staff_id
        JOIN 
            patients p ON t.patient_id = p.patient_id
        WHERE 
            t.patient_id = p_patient_id 
            AND a.start_time BETWEEN p_start_date AND p_end_date
            AND s.manager_id = p_user_id;  -- Manager's restriction
    END IF;
END //

DELIMITER ;


USE hospital_management;

drop view if exists get_doctors_list_available_slots;
-- Display to the get doctor's available slots
CREATE VIEW get_doctors_list_available_slots AS
    SELECT 
        s.staff_id,
        s.staff_name,
        DATE(ds.shift_start) AS date,
        TIME_FORMAT(ds.shift_start, '%H:%i') AS start_time,
        TIME_FORMAT(ds.shift_end, '%H:%i') AS end_time,
        ds.availability_status
    FROM
        staff s
            JOIN
        doctor_schedules ds ON s.staff_id = ds.staff_id
    WHERE
        s.job_type = 'Doctor' AND ds.availability_status = 'Available' AND (shift_start >= NOW());
        
drop procedure if exists sp_book_appointment;
-- PATIENT BOOK AN APPOINTMENT
DELIMITER $$ 
CREATE PROCEDURE sp_book_appointment(
IN patientId INT,
IN doctorId INT,
IN purpose VARCHAR(225),
IN appointmentDate VARCHAR(10),
IN startTime VARCHAR(10),
IN endTime VARCHAR(10),
OUT treatmentId INT
)
this_proc:
BEGIN
DECLARE formattedStart DATETIME;
DECLARE formattedEnd DATETIME;
DECLARE newAppointmentId INT;
DECLARE _rollback BOOL DEFAULT 0;
DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET _rollback = 1;

-- Format the date and time, add second to get the HH:mm:ss time format
SET formattedStart = CONCAT(appointmentDate, ' ', startTime, ':00');
SET formattedEnd = CONCAT(appointmentDate, ' ', endTime, ':00');
-- START TRANSACTION;

-- Check if there is any overlapping appointment 
IF EXISTS (SELECT 1 FROM appointments 
WHERE staff_id = doctorId
AND start_time = formattedStart
AND end_time = formattedEnd
AND status = 'Upcoming' FOR UPDATE)
THEN ROLLBACK; -- Rollback if there is a conflict
SIGNAL SQLSTATE '45000' SET message_text = 'This timeslot is already booked. Please choose another timeslot';
LEAVE this_proc;
END IF;

-- Lock the doctor’s schedule before making updates
    SELECT availability_status 
    FROM doctor_schedules 
    WHERE staff_id = doctorId 
    AND shift_start = formattedStart 
    AND shift_end = formattedEnd
    FOR UPDATE;

-- Insert a new appointment
INSERT INTO appointments (patient_id, staff_id, purpose, status, start_time, end_time, payment_amount)
VALUES (patientId, doctorId, purpose, 'Upcoming', formattedStart, formattedEnd, 120.0);
SELECT patient_id, staff_id, purpose, status, start_time, end_time, payment_amount from appointment where staff_id = doctorId
AND start_time = formattedStart
AND status = 'Upcoming';

-- Get the newly inserted appointment ID
SELECT appointment_id INTO newAppointmentId FROM appointments WHERE staff_id = doctorId
AND start_time = formattedStart
AND status = 'Upcoming';

-- Insert a new treatment note for this appointment
INSERT INTO treatments (patient_id, appointment_id, treatment_date)
VALUES (patientId, newAppointmentId, formattedStart);

-- Get the newly inserted treatment ID
SELECT treatment_id INTO treatmentId FROM treatments WHERE appointment_id = newAppointmentId;

-- Update the doctor's schedule availability status to 'Busy'
UPDATE doctor_schedules SET availability_status = 'Busy'
WHERE staff_id = doctorId AND shift_start = formattedStart AND shift_end = formattedEnd;

-- Handle commit or rollback
IF _rollback THEN ROLLBACK; ELSE COMMIT;
END IF;
END $$
DELIMITER ;


drop procedure if exists sp_cancel_appointment;
-- PATIENT CANCEL APPOINTMENT
DELIMITER $$
CREATE PROCEDURE sp_cancel_appointment(
IN appointmentId INT,
OUT treatmentId INT)
this_proc:
BEGIN
    DECLARE doctorId INT;
    DECLARE startTime DATETIME;
    DECLARE endTime DATETIME;
    DECLARE appointmentExists BOOLEAN DEFAULT FALSE;
	DECLARE `_rollback` BOOL DEFAULT 0;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;


    START TRANSACTION;

     -- Check if the appointment exists
    IF NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = appointmentId FOR UPDATE) THEN
        -- ROLLBACK;
        SIGNAL SQLSTATE '45000' SET message_text = 'No appointment to cancel';
        LEAVE this_proc;
    END IF;

    -- Get the doctor's ID and appointment times
    SELECT staff_id, start_time, end_time 
    INTO doctorId, startTime, endTime FROM appointments 
    WHERE appointment_id = appointmentId;
    
    -- Get the treatment's ID of the appointment
	SELECT treatment_id INTO treatmentId FROM treatments WHERE appointment_id = appointmentId;
    
    -- Delete the appointment
    UPDATE appointments 
SET status = 'Cancelled', 
    payment_amount = 0.0 
WHERE appointment_id = appointmentId;

	-- Delete the treatment of that appointment 
    DELETE FROM treatments WHERE appointment_id = appointmentId;
    
    -- Update the doctor's schedule availability status to 'Available'
    UPDATE doctor_schedules 
    SET availability_status = 'Available'
    WHERE staff_id = doctorId 
    AND shift_start = startTime
    AND shift_end = endTime;

-- Handle commit or rollback
IF `_rollback` THEN ROLLBACK; ELSE COMMIT;
END IF;
END $$
DELIMITER ;

drop procedure if exists sp_add_doctor_schedule;
-- DOCTOR ADD NEW SCHEDULE
DELIMITER $$
CREATE PROCEDURE sp_add_doctor_schedule(
    IN doctorId INT,
    IN shiftStart DATETIME,
    IN shiftEnd DATETIME
)
this_proc:
BEGIN

--     START TRANSACTION;

    -- Check if shiftStart is in the future
    IF shiftStart <= NOW() THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET message_text = 'Shift start time must be in the future';
        LEAVE this_proc;
    END IF;

    -- Check if shiftStart is before shiftEnd
    IF shiftStart >= shiftEnd THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET message_text = 'Shift start time must be before shift end time';
        LEAVE this_proc;
    END IF;

    -- Check for overlapping schedules
    IF EXISTS (
        SELECT 1 
        FROM doctor_schedules
        WHERE staff_id = doctorId
        AND (
            (shiftStart >= shift_start AND shiftStart < shift_end) OR 
            (shiftEnd > shift_start AND shiftEnd <= shift_end) OR
            (shiftStart <= shift_start AND shiftEnd >= shift_end))
    ) THEN ROLLBACK;
        SIGNAL SQLSTATE '45000' SET message_text = 'The schedule overlaps with an existing schedule.';
        LEAVE this_proc;
    END IF;

    -- If no overlap, insert the new schedule
    INSERT INTO doctor_schedules (staff_id, shift_start, shift_end, availability_status)
    VALUES (doctorId, shiftStart, shiftEnd, 'Available');

END $$
DELIMITER ;

drop procedure if exists sp_delete_doctor_schedule
-- DELETE DOCTOR SCHEDULE
DELIMITER $$
CREATE PROCEDURE sp_delete_doctor_schedule (
    IN doctorId INT,
    IN scheduleId INT
)
this_proc:
BEGIN
    DECLARE startTime DATETIME;
    -- DECLARE `_rollback` BOOL DEFAULT 0;
--     DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;

--     START TRANSACTION;

    -- Retrieve the start time of the schedule
    SELECT shift_start INTO startTime 
    FROM doctor_schedules 
    WHERE schedule_id = scheduleId 
    AND staff_id = doctorId;

    -- Check if the schedule with the given scheduleId and doctorId exists and is available
    IF NOT EXISTS (
        SELECT 1 
        FROM doctor_schedules
        WHERE shift_start = startTime
        AND staff_id = doctorId
        AND schedule_id = scheduleId
        AND availability_status = 'Available'
    ) THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET message_text = 'Schedule is either already passed, booked, or not available';
        LEAVE this_proc;
    END IF;

    -- Check if the schedule has already passed the current time
    IF EXISTS (
        SELECT 1 
        FROM doctor_schedules
        WHERE shift_start = startTime
        AND staff_id = doctorId
        AND schedule_id = scheduleId
        AND shift_end < NOW()
    ) THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET message_text = 'Cannot delete past schedule';
        LEAVE this_proc;
    END IF;
    
    -- Delete the schedule if all checks are passed
    DELETE FROM doctor_schedules
    WHERE schedule_id = scheduleId
    AND staff_id = doctorId;
    
    -- Handle commit or rollback
    -- IF `_rollback` THEN
--         ROLLBACK;
--     ELSE
--         COMMIT;
--     END IF;
END $$
DELIMITER ;


