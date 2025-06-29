const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ranjith@123",
  database: "approval2025",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("database connected");
});

module.exports = connection;
