const db = require("../config/db");

async function home(req, res) {
  const name = req.user.name;
  if (!name) return res.status(401).json({ msg: "user not found" });

  try {
    const collegeCode = req.body.collegeCode;

    if (!collegeCode) {
      return res.status(400).json({ err: "collegeCode is required" });
    }
    getQ = `select name_of_college,letter_no,dated,p_letter_no,p_dated from college_info where c_code = ?`;
    const [result] = await db.query(getQ, [collegeCode]);
    res.status(200).send(result);
  } catch (err) {
    return res.status(500).json({ sqlErr: "Database Error", err: err.message });
  }
}

async function editHome(req, res) {
  const name = req.user.name;
  if (!name) return res.status(401).json({ msg: "user not found" });
  try {
    const collegeCode = req.body.collegeCode;
    if (!collegeCode) {
      return res.status(400).json({ err: "collegeCode is required" });
    }
    editQ = `update college_info set `;
  } catch (err) {
    return res.status(500).json({ error: "Database error", err: err.message });
  }
}
module.exports = { home, editHome };
