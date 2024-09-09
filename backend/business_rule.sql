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
