const mysql = require("../config/db");
const bcrypt = require("bcryptjs");

const mockData = async () => {
  try {
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Insert patients
    await mysql
      .promise()
      .query(
        "INSERT INTO patients (patient_name, email, password, dob, gender, allergies, contact_info, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          "John Doe",
          "john@example.com",
          hashedPassword,
          "1990-01-01",
          "Male",
          "None",
          "123-456-7890",
          "123 Main St",
        ]
      );
    await mysql
      .promise()
      .query(
        "INSERT INTO patients (patient_name, email, password, dob, gender, allergies, contact_info, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          "Jane Doe",
          "jane@example.com",
          hashedPassword,
          "1985-05-05",
          "Female",
          "Peanuts",
          "123-456-7891",
          "456 Maple Ave",
        ]
      );

    // Insert staff
    await mysql
      .promise()
      .query(
        "INSERT INTO staffs (staff_name, email, password, department_id, qualification, salary, job_type, start_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          "Dr. Smith",
          "drsmith@example.com",
          hashedPassword,
          1,
          "MBBS",
          80000,
          "doctor",
          "2023-01-01",
        ]
      );
    await mysql
      .promise()
      .query(
        "INSERT INTO staffs (staff_name, email, password, department_id, qualification, salary, job_type, start_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          "Manager Mike",
          "mike@example.com",
          hashedPassword,
          2,
          "MBA",
          90000,
          "manager",
          "2023-02-01",
        ]
      );
    await mysql
      .promise()
      .query(
        "INSERT INTO staffs (staff_name, email, password, department_id, qualification, salary, job_type, start_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          "Admin Alice",
          "alice@example.com",
          hashedPassword,
          3,
          "BSc Admin",
          70000,
          "admin",
          "2023-03-01",
        ]
      );

    console.log("Data seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

mockData();
