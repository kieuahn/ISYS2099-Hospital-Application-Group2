const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
// const connectMongoDB = require("./config/mongoDb");

const authMiddleware = require("./middleware/authMiddleware");
// ROUTES
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes")
const doctorRoutes = require("./routes/doctorRoutes")

require("dotenv").config();
dotenv.config();
// connectMongoDB();
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/doctor", doctorRoutes);

// Protected route example
app.get("/api/patient-data", authMiddleware(["patient"]), (req, res) => {
  res.json({ message: "This is protected patient data" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
