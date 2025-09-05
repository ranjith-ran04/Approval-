const db = require("../config/db");

const student_count = async (req, res) => {
  const c_code = req.user.counsellingCode; // From JWT
  const b_code = req.body.b_code; // From frontend
  // console.log(c_code);

  try {
    const [rows] = await db.query(
      `SELECT substring((select a_no  as cnt 
       FROM student_info 
       WHERE c_code = ? 
		 AND b_code = ?
         AND CATOGORY != 'GOVERNMENT'
         order by a_no desc limit 1), -3) as str`,
      [c_code, b_code]
    );
    console.log(rows[0]);

    res.status(200).json({ count: Number(rows[0].str), collegeCode: c_code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

module.exports = student_count;
