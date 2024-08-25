CREATE DATABASE hospital_management;
use hospital_management;

DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS staffs;
DROP TABLE IF EXISTS patient_credentials;
DROP TABLE IF EXISTS staff_credentials


-- Patient table-- 
CREATE TABLE patients (
    patient_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(50) NOT NULL,
    allergies TEXT,
    contact_number VARCHAR(15),
    date_of_birth DATE,
    gender ENUM('Male', 'Female', 'Other'),
    address VARCHAR(225),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- Staff table
CREATE TABLE staffs (
    staff_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_id INT NOT NULL,
    manager_id INT DEFAULT 1,
    qualification VARCHAR(50),
    staff_name VARCHAR(50) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    job_type ENUM('doctor', 'manager', 'admin') NOT NULL,
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
) ENGINE=InnoDB;

-- Patient credentials table
CREATE TABLE patient_credentials (
    patient_credentials_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
) ENGINE=InnoDB;

-- Staff credentials table
CREATE TABLE staff_credentials (
    staff_credentials_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('doctor', 'manager', 'admin') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staffs(staff_id)
) ENGINE=InnoDB;

-- departments table
CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL
)

-- Change for add-doctor function, might be change in the future


-- ALTER TABLE staffs ADD INDEX (department_id);
-- ALTER TABLE staff_credentials ADD INDEX (email);