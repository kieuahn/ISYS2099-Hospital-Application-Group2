const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
// const connectMongoDB = require("./config/mongoDb");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

require("dotenv").config();
dotenv.config();
// connectMongoDB();
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// Protected route example
app.get("/api/patient-data", authMiddleware(["patient"]), (req, res) => {
  res.json({ message: "This is protected patient data" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
