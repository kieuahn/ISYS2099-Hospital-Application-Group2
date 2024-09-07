-- Create the Hospital Management Database
CREATE DATABASE hospital_management;
USE hospital_management;

-- Drop database hospital_management;
-- Drop existing tables if they exist
DROP TABLE IF EXISTS doctor_schedule;
DROP TABLE IF EXISTS performance_rating;
DROP TABLE IF EXISTS job_history;
DROP TABLE IF EXISTS treatments;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS staff_credentials;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS patient_credentials;
DROP TABLE IF EXISTS staff_credentials;


-- Patient table-- 

-- Patients Table
CREATE TABLE patients (
    patient_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(225) NOT NULL,
    allergies TEXT,
    contact_number VARCHAR(15),
    dob DATE,
    gender ENUM('Male', 'Female', 'Other'),
    address VARCHAR(225),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=INNODB;

-- ALTER TABLE patients 
-- ADD CONSTRAINT pk_patient_id 
-- PRIMARY KEY (patient_id);

-- Patient Credentials Table
CREATE TABLE patient_credentials (
    email VARCHAR(100) NOT NULL,
    password VARCHAR(225) NOT NULL,
    patient_id INT NOT NULL
) ENGINE=INNODB;

ALTER TABLE patient_credentials 
ADD CONSTRAINT pk_patient_credentials 
PRIMARY KEY (patient_id);

ALTER TABLE patient_credentials 
ADD CONSTRAINT fk_patient_credentials_patient 
FOREIGN KEY (patient_id) 
REFERENCES patients(patient_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE patient_credentials 
ADD CONSTRAINT uq_patient_credentials_email 
UNIQUE (email);

-- Department Table 
CREATE TABLE departments (
    department_id VARCHAR(6) NOT NULL,
    department_name VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

ALTER TABLE departments
ADD CONSTRAINT pk_department_id PRIMARY KEY (department_id);

-- Staff Table
CREATE TABLE staff (
    staff_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    staff_name VARCHAR(225) NOT NULL,
    department_id VARCHAR(6),
    manager_id INT,
    qualification VARCHAR(50),
    salary DECIMAL(10, 2) NOT NULL,
    job_type ENUM('Doctor', 'Manager', 'Admin') NOT NULL,
    start_date DATE NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=INNODB;

ALTER TABLE staff 
ADD CONSTRAINT fk_department_id 
FOREIGN KEY (department_id)
REFERENCES departments(department_id)
ON DELETE CASCADE
ON UPDATE CASCADE;


-- Staff Credentials Table
CREATE TABLE staff_credentials (
    email VARCHAR(100) NOT NULL,
    password VARCHAR(225) NOT NULL,
    staff_id INT NOT NULL,
    job_type ENUM('Doctor', 'Manager', 'Admin') NOT NULL
) ENGINE=INNODB;

ALTER TABLE staff_credentials 
ADD CONSTRAINT pk_staff_credentials 
PRIMARY KEY (staff_id);

ALTER TABLE staff_credentials 
ADD CONSTRAINT uq_staff_credentials_email 
UNIQUE (email);

ALTER TABLE staff_credentials 
ADD CONSTRAINT fk_staff_credentials_staff 
FOREIGN KEY (staff_id) 
REFERENCES staff(staff_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Appointments Table
CREATE TABLE appointments (
    appointment_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    staff_id INT NOT NULL,
    purpose VARCHAR(225) NOT NULL,
    status ENUM('Upcoming', 'Cancelled', 'Completed', 'Proceeding') NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    payment_amount DECIMAL(10, 2)
) ENGINE=INNODB;

ALTER TABLE appointments 
ADD CONSTRAINT fk_appointment_patient 
FOREIGN KEY (patient_id) 
REFERENCES patients(patient_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE appointments 
ADD CONSTRAINT fk_appointment_staff 
FOREIGN KEY (staff_id) 
REFERENCES staff(staff_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Treatments Table
CREATE TABLE treatments (
    treatment_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    appointment_id INT NOT NULL,
    diagnosis TEXT,
    treatment_procedure TEXT,
    treatment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    medication VARCHAR(225),
    instruction VARCHAR(500)
) ENGINE=INNODB;

ALTER TABLE treatments 
ADD CONSTRAINT uq_treatments_appointment_id 
UNIQUE (appointment_id);

ALTER TABLE treatments 
ADD CONSTRAINT fk_treatment_appointment 
FOREIGN KEY (appointment_id) 
REFERENCES appointments(appointment_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE treatments 
ADD CONSTRAINT fk_treatment_patient_id 
FOREIGN KEY (patient_id) 
REFERENCES patients(patient_id)
ON DELETE CASCADE
ON UPDATE CASCADE;


-- Job History Table
CREATE TABLE job_history (
    staff_history_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    staff_name VARCHAR(225) NOT NULL,
    department_id VARCHAR(6),
    manager_id INT,
    qualification VARCHAR(50),
    salary DECIMAL(10, 2) NOT NULL,
    job_type ENUM('Doctor', 'Manager', 'Admin') NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=INNODB;

ALTER TABLE job_history 
ADD CONSTRAINT fk_staff_id 
FOREIGN KEY (staff_id) 
REFERENCES staff(staff_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE job_history 
ADD CONSTRAINT fk_history_department_id 
FOREIGN KEY (department_id) 
REFERENCES departments(department_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE job_history 
ADD CONSTRAINT fk_history_manager_id 
FOREIGN KEY (manager_id) 
REFERENCES staff(staff_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Performance Rating Table
CREATE TABLE performance_rating (
    performance_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    appointment_id INT NOT NULL,
    performance_rating DECIMAL(3, 2) NOT NULL
) ENGINE=InnoDB;

ALTER TABLE performance_rating 
ADD CONSTRAINT uq_appointment_id 
UNIQUE (appointment_id);

ALTER TABLE performance_rating 
ADD CONSTRAINT fk_performance_doctor 
FOREIGN KEY (doctor_id) 
REFERENCES staff(staff_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE performance_rating 
ADD CONSTRAINT fk_performance_appointment 
FOREIGN KEY (appointment_id) 
REFERENCES appointments(appointment_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Schedule Table
CREATE TABLE doctor_schedules (
    schedule_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    shift_start DATETIME NOT NULL,
    shift_end DATETIME NOT NULL,
    availability_status ENUM('Available', 'Busy') NOT NULL
) ENGINE=InnoDB;

ALTER TABLE doctor_schedules 
ADD CONSTRAINT fk_schedule_staff 
FOREIGN KEY (staff_id) 
REFERENCES staff(staff_id)
ON DELETE CASCADE
ON UPDATE CASCADE;