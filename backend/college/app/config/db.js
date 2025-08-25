const mysql = require("mysql2/promise");

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Vishnu12*#",
  database: "approval_2025", 
});


module.exports = connection;