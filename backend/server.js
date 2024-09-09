const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectMongoDB = require("./config/mongoDb");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const doctorRoutes = require("./routes/doctorRoutes")
const staffRoutes = require('./routes/staffRoutes');
const departmentRoutes = require('./routes/departmentRoutes');

require("dotenv").config();
dotenv.config();

connectMongoDB();
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use('/api',authMiddleware(['Admin', 'Manager', 'Doctor']), departmentRoutes);
app.use("/api/staff", authMiddleware(['Admin', 'Manager']), staffRoutes); 
app.use("/api/patient", authMiddleware(['Admin', 'Manager', 'Doctor', 'Patient']), patientRoutes); 
app.use("/api/doctor", authMiddleware(['Dcotor']), doctorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
