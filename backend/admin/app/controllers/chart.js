const db = require("../config/db");

const communityFetch = async (req, res) => {
  const name = req.user.name;
  const collegeCode = req.body.collegeCode;
  if (!name) return res.status(401).json({ msg: "user not found" });
  try {
    const sql = `SELECT community, COUNT(*) as count FROM student_info WHERE c_code = ? GROUP BY community`;
    const [result1] = await db.query(sql, [collegeCode]);
    const sql2 = `SELECT catogory, COUNT(*) as count FROM student_info WHERE c_code = ? GROUP BY catogory`;
    const [result2] = await db.query(sql2, [collegeCode]);
    res.status(200).send([result1, result2]);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Database error", err: error.message });
  }
};

module.exports = communityFetch;
