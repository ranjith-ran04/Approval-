const pdf = require("pdfkit");
const db = require("../config/db");
const path = require("path");
const arialBold = path.join(__dirname, "../fonts/G_ari_bd.TTF");
const arial = path.join(__dirname, "../fonts/arial.ttf");
const { header,footer } = require("./pageFrame");

function forma(req, res) {
  const { collegeCode } = req.query;
  const query = "select * from student_info where c_code=?";

  db.query(query, [collegeCode], (err, result) => {
    if (err) {
      res.status(500).json({ msg: "Error in query" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="formb.pdf"');

    const doc = new pdf({
      size: "A4",
      layout: "landscape",
      margin: 8,
      bufferPages: true,
    });
    doc.pipe(res);
    doc.registerFont("Arial-Bold", arialBold);
    doc.registerFont("Arial", arial);
    header("A", doc, collegeCode);

    const remainingHeight = doc.page.height - doc.y - doc.page.margins.bottom;
    const extraSpaceNeeded = 150; 
    if (remainingHeight < extraSpaceNeeded) {
      doc.addPage(); // this becomes the new last page
      header("A", doc, collegeCode);
    }
    footer(doc);  

    doc.end();
  });
}

module.exports = forma;
