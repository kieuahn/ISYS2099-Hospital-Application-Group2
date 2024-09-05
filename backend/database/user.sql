/**
 * Creates roles for Admin, Manager, Doctor, and Patient
 *
 * This script creates four roles and assigns them to corresponding users.
 * The roles are:
 * - admin: highest level of access
 * - manager: middle level of access
 * - doctor: limited access
 * - patient: lowest level of access
 *
 * Example:
 * Run this script in a MySQL environment to create the roles and users.
 */
CREATE ROLE 'admin';
CREATE ROLE 'manager';
CREATE ROLE 'doctor';
CREATE ROLE 'patient';

/**
 * Creates MySQL users and assigns roles
 *
 * This script creates four users and assigns the corresponding roles to each user.
 * The users are:
 * - admin_user: has admin role
 * - manager_user: has manager role
 * - doctor_user: has doctor role
 * - patient_user: has patient role
 *
 * Example:
 * Run this script in a MySQL environment to create the users and assign roles.
 */
CREATE USER 'admin_user'@'localhost' IDENTIFIED BY 'admin_password';
GRANT 'admin' TO 'admin_user';

CREATE USER 'manager_user'@'localhost' IDENTIFIED BY 'manager_password';
GRANT 'manager' TO 'manager_user';

CREATE USER 'doctor_user'@'localhost' IDENTIFIED BY 'doctor_password';
GRANT 'doctor' TO 'doctor_user';

CREATE USER 'patient_user'@'localhost' IDENTIFIED BY 'patient_password';
GRANT 'patient' TO 'patient_user';

/**
 * Applies role automatically when the user logs in
 *
 * This script sets the default role for each user when they log in.
 * This ensures that the user has the correct level of access.
 *
 * Example:
 * Run this script in a MySQL environment to set the default roles.
 */
SET DEFAULT ROLE 'admin' FOR 'admin_user'@'localhost';
SET DEFAULT ROLE 'manager' FOR 'manager_user'@'localhost';
SET DEFAULT ROLE 'doctor' FOR 'doctor_user'@'localhost';
SET DEFAULT ROLE 'patient' FOR 'patient_user'@'localhost';

/**
 * Grants privileges to different roles in the hospital management system.
 *
 * This script grants privileges to four roles: admin, manager, doctor, and patient.
 * Each role has specific privileges to ensure proper access control and security.
 */

/**
 * Admin role has full control over all tables and procedures.
 *
 * Example: The admin user can perform any operation on any table or procedure in the hospital_management database.
 */
GRANT ALL PRIVILEGES ON hospital_management.* TO 'admin';

/**
 * Manager role can manage doctors and appointments they supervise.
 *
 * Example: The manager user can view, insert, and update staff information, view patient information, execute the AddDoctor procedure, and view appointment information.
 */
GRANT SELECT, INSERT, UPDATE ON hospital_management.staff TO 'manager';
GRANT SELECT ON hospital_management.patients TO 'manager';
GRANT EXECUTE ON PROCEDURE hospital_management.AddDoctor TO 'manager';
GRANT SELECT ON hospital_management.appointments TO 'manager';

/**
 * Doctor role can view patients they treat and update treatments.
 *
 * Example: The doctor user can view and update patient information, view and update treatment information, and view appointment information.
 */
GRANT SELECT, UPDATE ON hospital_management.patients TO 'doctor';
GRANT SELECT, UPDATE ON hospital_management.treatments TO 'doctor';
GRANT SELECT ON hospital_management.appointments TO 'doctor';

/**
 * Patient role can view their appointments and treatments.
 *
 * Example: The patient user can view their appointment information and treatment information.
 */
GRANT SELECT ON hospital_management.appointments TO 'patient';
GRANT SELECT ON hospital_management.treatments TO 'patient';