const db = require("../config/db");

const student_count = async (req, res) => {
  const c_code = req.user.counsellingCode; // From JWT
  const b_code = req.body.b_code; // From frontend
  // console.log(c_code);

  try {
    const [rows] = await db.query(
      `SELECT COUNT(*) as cnt 
       FROM student_info 
       WHERE c_code = ? 
         AND b_code = ? 
         AND CATOGORY != 'GOVERNMENT'`,
      [c_code, b_code]
    );

    res.status(200).json({ count: rows[0].cnt, collegeCode: c_code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

module.exports = student_count;
