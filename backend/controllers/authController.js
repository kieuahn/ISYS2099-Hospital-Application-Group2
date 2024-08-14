const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("../config/db");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let query;
    let user;
    let role;

    // First, check if the user is a patient
    query = "SELECT * FROM patients WHERE email = ?";
    const [patientRows] = await mysql.promise().query(query, [email]);

    if (patientRows.length > 0) {
      user = patientRows[0];
      role = "patient";
    } else {
      // If not a patient, check in the staffs table
      query = "SELECT * FROM staffs WHERE email = ?";
      const [staffRows] = await mysql.promise().query(query, [email]);

      if (staffRows.length === 0) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      user = staffRows[0];
      role = user.job_type; // Assume job_type represents the role (doctor, manager, admin)
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token, role });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const signup = async (req, res) => {
  const { patient_name, email, password } = req.body;

  try {
    // Check if the email already exists
    const [existingPatient] = await mysql
      .promise()
      .query("SELECT * FROM patients WHERE email = ?", [email]);

    if (existingPatient.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new patient into the database
    await mysql
      .promise()
      .query(
        "INSERT INTO patients (patient_name, email, password) VALUES (?, ?, ?)",
        [patient_name, email, hashedPassword]
      );

    res.status(201).json({ message: "Signup successful!" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  login,
  signup,
};
