const mysql = require("mysql2/promise");

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "oracle@hasan30",
  database: "aprv_old", 
});


module.exports = connection;