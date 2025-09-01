const mysql = require("mysql2/promise");

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Vishnu12*#",
  database: "approval_new", 
});


module.exports = connection;