// index.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Vishnu12*#", // change if needed
  database: "approval_2025", // change this
});

// Route 1 - Community Distribution
app.get("/api/community-distribution", (req, res) => {
  const sql = `SELECT community, COUNT(*) as count FROM student_info WHERE c_code = 5901 GROUP BY community`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Community query error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// Route 2 - Category Distribution
app.get("/api/category-distribution", (req, res) => {
  const sql = `SELECT catogory, COUNT(*) as count FROM student_info WHERE c_code = 5901 GROUP BY catogory`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Category query error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
