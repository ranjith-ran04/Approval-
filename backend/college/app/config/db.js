const mysql = require("mysql2/promise");

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Kanna@2006",
  database: "approvalsample2", 
});


module.exports = connection;