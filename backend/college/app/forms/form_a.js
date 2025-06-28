const pdf = require("pdfkit");
const db = require("../config/db");

function forma(req, res) {
  const { collegeCode } = req.query;
  const query = "select * from student_info where c_code=?";
  db.query(query, [collegeCode], (err, result) => {
    if (err) {
      res.status(500).json({ msg: "error in query" });
    } else {
      console.log(result);
      res.send(result[0]);
      const doc = new pdf();
    }
  });
}

module.exports = forma;