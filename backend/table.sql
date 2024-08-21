CREATE DATABASE hospital_management;
use hospital_management;

-- users_credentials
CREATE TABLE patient_credentials (
    patient_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('patient') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE staff_credentials (
    staff_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('doctor', 'manager', 'admin') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


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
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient_credentials(patient_id)
) ENGINE=InnoDB;
-- Staff table
CREATE TABLE staffs (
    staff_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_id INT NOT NULL,
    manager_id INT NOT NULL,
    qualification VARCHAR(50),
    staff_name VARCHAR(50) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    job_type ENUM('doctor', 'manager', 'admin') NOT NULL,
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff_credentials(staff_id)

) ENGINE=InnoDB;

-- Change for add-doctor function, might be change in the future
ALTER TABLE staffs MODIFY manager_id INT DEFAULT 1;


-- ALTER TABLE staffs ADD INDEX (department_id);
-- ALTER TABLE staff_credentials ADD INDEX (email);