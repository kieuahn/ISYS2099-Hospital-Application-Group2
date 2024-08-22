const mysql = require("../config/db")
const bcrypt = require("bcryptjs");

const seedData = async () => {
  try {
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Insert patients into patient_credentials and patients tables
    await mysql.promise().query(
      "INSERT INTO patient_credentials (email, password) VALUES (?, ?)",
      ['patient1@example.com', hashedPassword]
    );
    await mysql.promise().query(
      "INSERT INTO patients (patient_id, patient_name) VALUES (LAST_INSERT_ID(), 'John Doe')"
    );

    await mysql.promise().query(
      "INSERT INTO patient_credentials (email, password) VALUES (?, ?)",
      ['patient2@example.com', hashedPassword]
    );
    await mysql.promise().query(
      "INSERT INTO patients (patient_id, patient_name) VALUES (LAST_INSERT_ID(), 'Jane Smith')"
    );

    // Insert staff into staff_credentials and staffs tables
    await mysql.promise().query(
      "INSERT INTO staff_credentials (email, password, role) VALUES (?, ?, 'doctor')",
      ['doctor1@example.com', hashedPassword]
    );
    await mysql.promise().query(
      "INSERT INTO staffs (staff_id, staff_name, department_id, manager_id, qualification, salary, job_type) VALUES (LAST_INSERT_ID(), 'Dr. Gregory House', 1, 1, 'MD', 120000, 'doctor')"
    );

    await mysql.promise().query(
      "INSERT INTO staff_credentials (email, password, role) VALUES (?, ?, 'manager')",
      ['manager1@example.com', hashedPassword]
    );
    await mysql.promise().query(
      "INSERT INTO staffs (staff_id, staff_name, department_id, manager_id, qualification, salary, job_type) VALUES (LAST_INSERT_ID(), 'Dr. James Wilson', 1, 1, 'MD', 140000, 'manager')"
    );

    await mysql.promise().query(
      "INSERT INTO staff_credentials (email, password, role) VALUES (?, ?, 'admin')",
      ['admin1@example.com', hashedPassword]
    );
    await mysql.promise().query(
      "INSERT INTO staffs (staff_id, staff_name, department_id, manager_id, qualification, salary, job_type) VALUES (LAST_INSERT_ID(), 'Lisa Cuddy', 1, 1, 'MBA', 160000, 'admin')"
    );

    console.log("Mock data seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
