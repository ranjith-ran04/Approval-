const db = require("../config/db");
const util = require("util");
const query = util.promisify(db.query).bind(db);

async function student(req, res) {
  try {
    const { collegeCode } = req.body;
    if (!collegeCode) {
      return res.status(400).json({ err: "collegeCode is required" });
    }
    const stdQuery = `select * from student_info`;
    const result = await query(stdQuery,[collegeCode]);
    res.status(200).send(result).json({ msg : "Student details sent Successfully."});

  } catch (err) {
    return res.status(500).json({ err: "Query error", sqlErr: err });
  }
}

module.exports ={student};
