const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "hospital_management"
});

// host: process.env.MYSQL_HOST,
// user: process.env.MYSQL_USER,
// password: process.env.MYSQL_PASSWORD,
// database: process.env.MYSQL_DATABASE

// connection.connect((err) => {
//   if (err) {
//     console.error("Error connecting to MySQL:", err);
//   } else {
//     console.log("Connected to MySQL");
//   }
// });

// module.exports = connection;

const mysql2 = require('mysql2/promise');
const poolPatient = mysql2.createPool({
  host: "localhost",
  user: "patient",
  password: "password1234",
  database: "hospital_management"
});

const poolShare = mysql.createPool({
  host: "localhost",
  user: "share",
  password: "password1234",
  database: "hospital_management"
});

const poolAdmin = mysql.createPool({
  host: "localhost",
  user: "admin",
  password: "password1234",
  database: "hospital_management"
});

const poolDoctor = mysql.createPool({
  host: "localhost",
  user: "doctor",
  password: "password1234",
  database: "hospital_management"
});

// const poolDoctor = mysql.createPool({
//   host: "localhost",
//   user: "doctor",
//   password: "password1234",
//   database: "hospital_management"
// });

module.exports = {
  poolPatient,
  poolDoctor,
  poolShare,
  poolAdmin
};