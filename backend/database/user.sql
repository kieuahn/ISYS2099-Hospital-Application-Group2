DROP USER IF EXISTS 'patient'@'%';
DROP USER IF EXISTS 'admin'@'%';
DROP USER IF EXISTS 'shared_user'@'%';
DROP USER IF EXISTS 'doctor'@'%';

-- PATIENT USER
CREATE USER IF NOT EXISTS 'patient'@'%' IDENTIFIED BY 'password1234';

GRANT SELECT, UPDATE ON hospital_management.patients TO 'patient'@'%';
GRANT SELECT, INSERT, DELETE ON hospital_management.appointments TO 'patient'@'%';
GRANT SELECT, INSERT, DELETE ON hospital_management.treatments TO 'patient'@'%';
GRANT SELECT (staff_id, staff_name, department_id) ON hospital_management.staff TO 'patient'@'%';
GRANT SELECT ON hospital_management.departments TO 'patient'@'%';
GRANT SELECT ON hospital_management.doctor_schedules TO 'patient'@'%';
GRANT SELECT ON hospital_management.get_doctors_list_available_slots TO 'patient'@'%';
-- Grant permission for patient
GRANT EXECUTE ON PROCEDURE hospital_management.sp_book_appointment TO 'patient'@'%';
GRANT EXECUTE ON PROCEDURE hospital_management.sp_cancel_appointment TO 'patient'@'%';
GRANT SELECT ON hospital_management.patient_credentials TO 'patient'@'%';

-- SHARED USER
CREATE USER IF NOT EXISTS 'shared_user'@'%' IDENTIFIED BY 'password1234';
GRANT SELECT, INSERT ON staff_credentials TO 'shared_user'@'%';
GRANT SELECT, INSERT, UPDATE ON staff TO 'shared_user'@'%';
GRANT SELECT ON departments TO 'shared_user'@'%';
GRANT SELECT ON doctor_schedules TO 'shared_user'@'%';
GRANT SELECT ON appointments TO 'shared_user'@'%';
GRANT SELECT ON job_history TO 'shared_user'@'%';
GRANT SELECT ON patients TO 'shared_user'@'%';
GRANT SELECT ON treatments TO 'shared_user'@'%';
GRANT SELECT ON performance_rating TO 'shared_user'@'%';

-- Grant permissions for views (for example, StaffDetails and StaffByDepartment)
GRANT SELECT ON StaffDetails TO 'shared_user'@'%';
GRANT SELECT ON StaffByDepartment TO 'shared_user'@'%';
GRANT SELECT ON PatientDetails TO 'shared_user'@'%';

-- Grant EXECUTE permission for procedures used by both manager and admin
GRANT EXECUTE ON PROCEDURE GetDoctorSchedules TO 'shared_user'@'%';
GRANT EXECUTE ON PROCEDURE GetDoctorWorkload TO 'shared_user'@'%';
GRANT EXECUTE ON PROCEDURE UpdateStaffInfo TO 'shared_user'@'%';
GRANT EXECUTE ON PROCEDURE GetPatientTreatmentHistory TO 'shared_user'@'%';
GRANT EXECUTE ON PROCEDURE GetJobHistory TO 'shared_user'@'%';
GRANT EXECUTE ON PROCEDURE AddStaff TO 'shared_user'@'%';

-- ADMIN
CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED BY 'password1234';

GRANT SELECT, INSERT ON staff_credentials TO 'admin'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON staff TO 'admin'@'%';
GRANT SELECT ON departments TO 'admin'@'%';
GRANT SELECT ON doctor_schedules TO 'admin'@'%';
GRANT SELECT ON appointments TO 'admin'@'%';
GRANT SELECT ON job_history TO 'admin'@'%';
GRANT SELECT ON patients TO 'admin'@'%';
GRANT SELECT ON treatments TO 'admin'@'%';
GRANT SELECT ON performance_rating TO 'admin'@'%';

GRANT SELECT ON StaffDetails TO 'admin'@'%';
GRANT SELECT ON StaffByDepartment TO 'admin'@'%';
GRANT SELECT ON PatientDetails TO 'admin'@'%';

GRANT EXECUTE ON PROCEDURE GetDoctorSchedules TO 'admin'@'%';
GRANT EXECUTE ON PROCEDURE GetDoctorWorkload TO 'admin'@'%';
GRANT EXECUTE ON PROCEDURE UpdateStaffInfo TO 'admin'@'%';
GRANT EXECUTE ON PROCEDURE GetPatientTreatmentHistory TO 'admin'@'%';
GRANT EXECUTE ON PROCEDURE GetJobHistory TO 'admin'@'%';
GRANT EXECUTE ON PROCEDURE AddStaff TO 'admin'@'%';

-- DOCTOR
CREATE USER IF NOT EXISTS 'doctor'@'%' IDENTIFIED BY 'password1234';

GRANT SELECT ON appointments TO 'doctor'@'%';
GRANT SELECT, UPDATE ON treatments TO 'doctor'@'%';
GRANT SELECT, INSERT, DELETE ON doctor_schedules TO 'doctor'@'%';

GRANT EXECUTE ON PROCEDURE sp_add_doctor_schedule TO 'doctor'@'%';
GRANT EXECUTE ON PROCEDURE sp_delete_doctor_schedule TO 'doctor'@'%';


FLUSH PRIVILEGES;