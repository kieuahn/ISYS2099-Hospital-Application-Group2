require('dotenv').config();
const mysql = require('mysql2/promise');

const poolPatient = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_PATIENT_USER,
  password: process.env.MYSQL_PATIENT_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

const poolShare = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_SHARED_USER,
  password: process.env.MYSQL_SHARED_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

const poolAdmin = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_ADMIN_USER,
  password: process.env.MYSQL_ADMIN_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

const poolDoctor = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_DOCTOR_USER,
  password: process.env.MYSQL_DOCTOR_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

module.exports = {
  poolPatient,
  poolDoctor,
  poolShare,
  poolAdmin
};