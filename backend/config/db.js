const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "0925747216aeE",
  database: "hospital_management"
});

// host: process.env.MYSQL_HOST,
// user: process.env.MYSQL_USER,
// password: process.env.MYSQL_PASSWORD,
// database: process.env.MYSQL_DATABASE

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

module.exports = connection;
