const mysql = require("../config/db");
const bcrypt = require("bcryptjs");

const seedData = async () => {
  try {
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Insert patients into patient_credentials and patients tables
    await mysql.promise().query(
      "INSERT INTO patient_credentials (email, password) VALUES (?, ?)",
      ['patient1@example.com', hashedPassword]
    // Insert departments
    const [dept1] = await mysql.promise().query(
        "INSERT INTO departments (department_name) VALUES (?)",
        ['Emergency']
      );
    const [dept2] = await mysql.promise().query(
      "INSERT INTO departments (department_name) VALUES (?)",
      ['Cardiology']
    );
    const [dept3] = await mysql.promise().query(
      "INSERT INTO departments (department_name) VALUES (?)",
      ['Neurology']
    );
    const [dept4] = await mysql.promise().query(
      "INSERT INTO departments (department_name) VALUES (?)",
      ['Orthopedics']
    );
    const [dept5] = await mysql.promise().query(
      "INSERT INTO departments (department_name) VALUES (?)",
      ['Pediatrics']
    );

    await mysql.promise().query(
      "INSERT INTO patient_credentials (email, password) VALUES (?, ?)",
      ['patient2@example.com', hashedPassword]
    // Insert patients into patients and patient_credentials tables
    const [result1] = await mysql.promise().query(
        "INSERT INTO patients (patient_name, allergies, contact_number, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?)",
        ['John Doe', 'Peanuts', '555-1234', '1980-01-01', 'Male', '123 Main St']
      );
    await mysql.promise().query(
      "INSERT INTO patient_credentials (patient_id, email, password, role) VALUES (?, ?, ?, 'patient')",
      [result1.insertId, 'patient1@example.com', hashedPassword]
    );

    const [result2] = await mysql.promise().query(
      "INSERT INTO patients (patient_name, allergies, contact_number, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?)",
      ['Jane Smith', 'Shellfish', '555-5678', '1990-02-02', 'Female', '456 Oak Ave']
    );
    await mysql.promise().query(
      "INSERT INTO patient_credentials (patient_id, email, password, role) VALUES (?, ?, ?, 'patient')",
      [result2.insertId, 'patient2@example.com', hashedPassword]
    );

    // Insert staff into staffs and staff_credentials tables

    // Doctors
    const [doctor1] = await mysql.promise().query(
      "INSERT INTO staffs (staff_name, department_id, manager_id, qualification, salary, job_type) VALUES (?, ?, ?, ?, ?, 'doctor')",
      ['Dr. Gregory House', dept2.insertId, 1, 'MD', 120000]
    );
    await mysql.promise().query(
      "INSERT INTO staff_credentials (staff_id, email, password, role) VALUES (?, ?, ?, 'doctor')",
      [doctor1.insertId, 'doctor1@example.com', hashedPassword]
    );

    const [doctor2] = await mysql.promise().query(
      "INSERT INTO staffs (staff_name, department_id, manager_id, qualification, salary, job_type) VALUES (?, ?, ?, ?, ?, 'doctor')",
      ['Dr. Amelia Shepherd', dept3.insertId, 1, 'MD, Neurosurgery', 130000]
    );
    await mysql.promise().query(
      "INSERT INTO staff_credentials (staff_id, email, password, role) VALUES (?, ?, ?, 'doctor')",
      [doctor2.insertId, 'doctor2@example.com', hashedPassword]
    );

    const [doctor3] = await mysql.promise().query(
      "INSERT INTO staffs (staff_name, department_id, manager_id, qualification, salary, job_type) VALUES (?, ?, ?, ?, ?, 'doctor')",
      ['Dr. Owen Hunt', dept1.insertId, 1, 'MD, Trauma Surgery', 125000]
    );
    await mysql.promise().query(
      "INSERT INTO staff_credentials (staff_id, email, password, role) VALUES (?, ?, ?, 'doctor')",
      [doctor3.insertId, 'doctor3@example.com', hashedPassword]
    );

    // Managers
    const [manager1] = await mysql.promise().query(
      "INSERT INTO staffs (staff_name, department_id, manager_id, qualification, salary, job_type) VALUES (?, ?, ?, ?, ?, 'manager')",
      ['Dr. James Wilson', dept2.insertId, 1, 'MD', 140000]
    );
    await mysql.promise().query(
      "INSERT INTO staff_credentials (staff_id, email, password, role) VALUES (?, ?, ?, 'manager')",
      [manager1.insertId, 'manager1@example.com', hashedPassword]
    );

    const [manager2] = await mysql.promise().query(
      "INSERT INTO staffs (staff_name, department_id, manager_id, qualification, salary, job_type) VALUES (?, ?, ?, ?, ?, 'manager')",
      ['Dr. Miranda Bailey', dept5.insertId, 1, 'MD, Pediatrics', 145000]
    );
    await mysql.promise().query(
      "INSERT INTO staff_credentials (staff_id, email, password, role) VALUES (?, ?, ?, 'manager')",
      [manager2.insertId, 'manager2@example.com', hashedPassword]
    );

    // Admin
    const [admin1] = await mysql.promise().query(
      "INSERT INTO staffs (staff_name, department_id, manager_id, qualification, salary, job_type) VALUES (?, ?, ?, ?, ?, 'admin')",
      ['Lisa Cuddy', dept4.insertId, 1, 'MBA', 160000]
    );
    await mysql.promise().query(
      "INSERT INTO staff_credentials (staff_id, email, password, role) VALUES (?, ?, ?, 'admin')",
      [admin1.insertId, 'admin1@example.com', hashedPassword]
    );

    console.log("Mock data seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
