const mysql = require("mysql2/promise");

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Kanna@2006",
  database: "approvalsample", 
});


module.exports = connection;
// const mysql = require("mysql2");

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Kanna@2006",
//   database: "approvalsample",
// });

// connection.connect((err) => {
//   if (err) throw err;
//   console.log("database connected");
// });

// module.exports = connection;