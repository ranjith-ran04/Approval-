const pdf = require("pdfkit");
const db = require("../config/db");

function formb(req, res) {
  const { collegeCode } = req.body;
  const query = "select * from total_allotted where allot_coll_code=?";
  db.query(query, [collegeCode], (err, result) => {
    if (err) {
      res.status(500).json({ msg: "error in query" });
    } else {
      console.log(result);
      res.send(result[0]);
      const doc = pdf.document();
    }
  });
}

module.exports = formb;
