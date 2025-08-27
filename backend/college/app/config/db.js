const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "oracle@hasan30",
  database: "aprv_old", 
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Database connected");
    connection.release(); // release back to pool
  } catch (err) {
    console.error("Database connection failed:", err);
  }
})();

module.exports = pool;