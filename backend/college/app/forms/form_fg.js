const PDFDocument = require("pdfkit");
const db = require("../config/db");
const path = require("path");
const arialBold = path.join(__dirname, "../fonts/G_ari_bd.TTF");
const arial = path.join(__dirname, "../fonts/arial.ttf");
const { header, footer } = require("./pageFrame");

const columnWidths = {
  sno: 30,
  applno: 60,
  name: 200,
  quota: 60,
  community: 70,
  amount: 70,
};

const rowHeight = 25;
const pageHeight = 842;
const leftMargin = 50;
const topMargin = 40;

const getCollegeInfo = async (c_code) => {

  // const [results] = await 
  try{
  const [results]=await db.query(
    "SELECT freezed, name_of_college, address FROM college_info WHERE c_code = ?",
    [c_code],
  );
  console.log('hi')
    if (results.length === 0) return null;
      return results;
}catch(err){
  console.log(err)
}
}

// doc.pipe(res);
// doc.registerFont("Arial-Bold", arialBold);
// doc.registerFont("Arial", arial);
// header("B", doc, collegeCode);

// function drawHeader(doc, data, freezed, pageNum) {
//   doc.font("Times-Bold").fontSize(16).text("FORM-FG", { align: "center" });
//   if (freezed === "0") {
//     doc.font("Times-Roman").fontSize(12).text("(Rough Copy)", { align: "right" });
//   }
//   doc.moveDown(0.5);
//   doc.font("Times-Bold").fontSize(13).text(`${data.c_code} - ${data.name_of_college}`, {
//     align: "center",
//     underline: true,
//   });
//   doc.font("Times-Roman").fontSize(12).text(data.address, { align: "center" });
//   doc.moveDown().text("SECOND YEAR : 2024 - 2025", { align: "left" });
// }

function drawTableHeader(doc, y) {
  doc.font("Arial-Bold",arialBold).fontSize(11);
  const headers = ["S.no", "Applno", "Name", "Quota", "Community", "Amount"];
  let x = leftMargin;
  Object.entries(columnWidths).forEach(([key, width], i) => {
    doc.rect(x, y, width, rowHeight).stroke();
    doc.text(headers[i], x, y + 8, { align: "center", width });
    x += width;
  });
}

// function drawFooter(doc, pageNum) {
//   doc.font("Times-Italic").fontSize(10).text(`Page ${pageNum}`, 500, pageHeight - 60, {align: "center"});
// }

// function drawSignature(doc) {
//   const d = new Date();
//   const formattedDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
//   doc.moveDown(4);
//   doc.font("Times-Roman").fontSize(12);
//   doc.text(`Date: ${formattedDate}`, leftMargin, doc.y);
//   doc.text("College Seal", 250, doc.y - 15);
//   doc.text("Signature of Principal", 400, doc.y - 30);
// }

const formfg = async(req, res) => {
  const c_code = req.user.counsellingCode;
  if (!c_code) return res.status(400).send("Missing code");
  try{
  const college = getCollegeInfo(c_code)
    if (!college) return res.status(404).send("College not found");
  }catch(err){
    return res.status(500).send("College info fetch failed");
  }

    const doc = new PDFDocument({ margin: 8, size: "A4", bufferPages:true });
    res.setHeader("Content-Disposition", "attachment; filename=form_fg.pdf");
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);
    doc.registerFont("Arial-Bold", arialBold);
    doc.registerFont("Arial", arial);
    header("FG", doc, c_code);

    let y = topMargin;
    let pageNum = 1;

    // drawHeader(doc, { ...college, c_code }, college.freezed, pageNum);
    y = doc.y;

    const sql = `
      SELECT Amount, branch_name, a_no, name, catogory, community
      FROM (
        SELECT b_code, branch_name FROM branch_info WHERE c_code = ?
      ) AS b
      JOIN (
        SELECT Amount, b_code, a_no, name, catogory, community FROM student_info
        WHERE c_code = ? AND fg = 1 AND (Amount >= 0)
      ) AS s ON b.b_code = s.b_code
      ORDER BY branch_name
    `;
    try{
    const [results] = await db.query(sql, [c_code, c_code]);

      let currentBranch = null;
      let count = 1;

      results.forEach((row) => {
        const isNewBranch = currentBranch !== row.branch_name;

        if (isNewBranch) {
          currentBranch = row.branch_name;
          count = 1;

          if (y + 100 > pageHeight - 50) {
            // footer(doc, pageNum++);
            doc.addPage();
            header("FG", doc, c_code);
            y = doc.y;
          } else {
            y += 15;
          }

          doc.font("Arial-Bold",arialBold).fontSize(12).text(currentBranch, leftMargin, y);
          y += 20;

          drawTableHeader(doc, y);
          y += rowHeight;
        }

        if (y + rowHeight > pageHeight - 50) {
          // footer(doc, pageNum++);
          doc.addPage();
          header("FG", doc, c_code);
          y = doc.y;

          doc.font("Arial-Bold",arialBold).fontSize(12).text(currentBranch, leftMargin, y);
          y += 20;
          drawTableHeader(doc, y);
          y += rowHeight;
        }

        const quota = row.catogory === "GOVERNMENT" ? "GOVT" : "MNGT";
        doc.font("Times-Roman").fontSize(11);

        let x = leftMargin;

        doc.rect(x, y, columnWidths.sno, rowHeight).stroke();
        doc.text(count++, x, y + 6, { align: "center", width: columnWidths.sno });
        x += columnWidths.sno;

        doc.rect(x, y, columnWidths.applno, rowHeight).stroke();
        doc.text(row.a_no, x, y + 6, { align: "center", width: columnWidths.applno });
        x += columnWidths.applno;

        doc.rect(x, y, columnWidths.name, rowHeight).stroke();
        doc.text("  " + row.name, x, y + 6, { align: "center", width: columnWidths.name });
        x += columnWidths.name;

        doc.rect(x, y, columnWidths.quota, rowHeight).stroke();
        doc.text(quota, x, y + 6, { align: "center", width: columnWidths.quota });
        x += columnWidths.quota;

        doc.rect(x, y, columnWidths.community, rowHeight).stroke();
        doc.text(row.community, x, y + 6, { align: "center", width: columnWidths.community });
        x += columnWidths.community;

        doc.rect(x, y, columnWidths.amount, rowHeight).stroke();
        doc.text(row.Amount.toString(), x, y + 6, { align: "center", width: columnWidths.amount - 5 });

        y += rowHeight;
      });

      // drawSignature(doc);
      // drawFooter(doc, pageNum);
      footer(doc);
      console.log('hello')
      doc.end();
    }catch(err){
              console.error(err);
        doc.text("Database error");
        doc.end();
        return;
      };
};

module.exports = formfg

