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

require("dotenv").config();
dotenv.config();

// connectMongoDB();
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/patient", authMiddleware(['Admin', 'Manager', 'Doctor']), patientRoutes); 
app.use("/api/staff", authMiddleware(['Admin', 'Manager']), staffRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
