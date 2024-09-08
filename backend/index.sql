USE hospital_management;

-- APPOINTMENT TABLE
ALTER TABLE appointments
ADD INDEX idx_appointments_patient_id (patient_id);
ALTER TABLE appointments
ADD INDEX idx_appointments_staff_id (staff_id);
ALTER TABLE appointments
ADD INDEX idx_appointments_start_end_time (start_time, end_time);
ALTER TABLE appointments
ADD INDEX idx_appointments_status_start_end (status, start_time, end_time);

-- DOCTOR SCHEDULE TABLE 
ALTER TABLE doctor_schedules
ADD INDEX idx_doctor_schedules_staff_id (staff_id);
ALTER TABLE doctor_schedules
ADD INDEX idx_doctor_schedules_shift_start_end (shift_start, shift_end);
ALTER TABLE doctor_schedules
ADD INDEX idx_doctor_schedule_status_shift_start_end (availability_status, shift_start, shift_end);
ALTER TABLE doctor_schedules
ADD INDEX idx_doctor_schedule_shift_end (shift_end);

-- JOB HISTORY TABLE
ALTER TABLE job_history
ADD INDEX idx_job_history_staff_id (staff_id);
ALTER TABLE job_history
ADD INDEX idx_job_history_manager_id (manager_id);
ALTER TABLE job_history
ADD INDEX idx_job_history_department_id (department_id);

-- STAFF CREDENTIALS TABLE
ALTER TABLE staff_credentials
ADD INDEX idx_staff_credentials_email_password (email, password);

-- PATIENT CREDENTIALS TABLE
ALTER TABLE patient_credentials
ADD INDEX idx_patient_credentials_email_password (email, password);

-- PATIENTS TABLE
CREATE FULLTEXT INDEX idx_patients_patient_name ON patients(patient_name);

-- PERFORMANCE RATING TABLE
ALTER TABLE performance_rating
ADD INDEX idx_performance_rating_doctor_id (doctor_id);
ALTER TABLE performance_rating
ADD INDEX idx_performance_rating_appointment_id (appointment_id);

-- STAFF TABLE
ALTER TABLE staff
ADD INDEX idx_staff_manager_id (manager_id);
ALTER TABLE staff
ADD INDEX idx_staff_department_id (department_id);

-- TREATMENTS TABLE
ALTER TABLE treatments
ADD INDEX idx_treatments_patient_id (patient_id);
ALTER TABLE treatments
ADD INDEX idx_treatments_appointment_id (appointment_id);