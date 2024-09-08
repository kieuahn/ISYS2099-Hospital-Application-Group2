const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {poolPatient, poolShare} = require("../config/db");

const login = async (req, res) => {
   const { email, password } = req.body;

   try {
      let query;
      let user;
      let role;

      // First, check if the user is a patient
      query = "SELECT * FROM patient_credentials WHERE email = ?";
      const [patientRows] = await poolPatient.query(query, [email]);

      if (patientRows.length > 0) {
         user = patientRows[0];
         role = 'Patient'; 
      } else {
         // If not a patient, check in the staff_credentials table
         query = "SELECT sc.*, s.job_type FROM staff_credentials sc JOIN staff s ON sc.staff_id = s.staff_id WHERE sc.email = ?";
         const [staffRows] = await poolShare.query(query, [email]);
         
         if (staffRows.length === 0) {
            console.log("No staff found with this email.");
            return res.status(400).json({ message: "Invalid email" });
         }

         user = staffRows[0];
         console.log("User found:", user);
         role = user.job_type; 
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
         return res.status(400).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
         { user_id: user.patient_id || user.staff_id, role: role }, // Include role in the token
         process.env.JWT_SECRET,
         { expiresIn: "5h" }
      );

      // Log the role and token
      console.log("Generated token:", token);
      console.log("User role:", role);

      res.json({ token, role });
   } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
   }
};


const signup = async (req, res) => {
   const { patient_name, email, password } = req.body;

   let connection;

   try {
      connection = await poolPatient.promise().getConnection();
      await connection.beginTransaction(); // Start a transaction

      // Check if the email already exists
      const [existingPatient] = await connection.query(
         "SELECT * FROM patient_credentials WHERE email = ?",
         [email]
      );

      if (existingPatient.length > 0) {
         await connection.rollback();
         return res.status(400).json({ message: "Email already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new patient into the patient_credentials table
      const [result] = await connection.query(
         "INSERT INTO patient_credentials (email, password) VALUES (?, ?)",
         [email, hashedPassword]
      );

      const patient_id = result.insertId; // Get the inserted patient_id

      if (!patient_id) {
         await connection.rollback();
         return res.status(500).json({ message: "Failed to create patient credentials" });
      }

      // Insert the new patient information into the patients table
      await connection.query(
         "INSERT INTO patients (patient_id, patient_name) VALUES (?, ?)",
         [patient_id, patient_name]
      );

      await connection.commit(); // Commit the transaction

      res.status(201).json({ message: "Signup successful!" });
   } catch (error) {
      console.error("Signup error:", error);
      if (connection) await connection.rollback(); // Rollback the transaction in case of error
      res.status(500).json({ message: "Server error" });
   } finally {
      if (connection) connection.release(); // Release the connection
   }
};


module.exports = {
  login,
  signup,
};
