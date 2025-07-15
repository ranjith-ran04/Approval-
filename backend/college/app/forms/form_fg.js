const express = require("express");
const mysql = require("mysql2");
const PDFDocument = require("pdfkit");
const cors = require("cors");
const path = require("path");
const arialBold = path.join(__dirname, "../fonts/G_ari_bd.TTF");
const arial = path.join(__dirname, "../fonts/arial.ttf");
const { header, footer } = require("./pageFrame");

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Vishnu12*#",
  database: "approval_2025",
});

const columnWidths = {
  sno: 25,
  applno: 45,
  name: 120,
  quota: 40,
  community: 60,
  amount: 50,
};

const rowHeight = 25;
const pageHeight = 842;
const leftMargin = 40;
const topMargin = 40;

function getCollegeInfo(c_code, callback) {
  connection.query(
    "SELECT freezed, name_of_college, address FROM college_info WHERE c_code = ?",
    [c_code],
    (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(null, null);
      callback(null, results[0]);
    }
  );
}

res.setHeader("Content-Type", "application/pdf");
res.setHeader("Content-Disposition", "attachment; filename=form_fg.pdf");
doc.pipe(res);


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
  doc.font("Times-Bold").fontSize(11);
  const headers = ["S.no", "Applno", "Name", "Quota", "Community", "Amount"];
  let x = leftMargin;
  Object.entries(columnWidths).forEach(([key, width], i) => {
    doc.rect(x, y, width, rowHeight).stroke();
    doc.text(headers[i], x, y + 8, { align: "center", width });
    x += width;
  });
}

// function drawFooter(doc, pageNum) {
//   doc.font("Times-Italic").fontSize(10).text(`Page ${pageNum}`, 500, pageHeight - 50);
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



app.post("/form-fg", (req, res) => {
  const c_code = req.body.code;
  if (!c_code) return res.status(400).send("Missing code");

  getCollegeInfo(c_code, (err, college) => {
    if (err) return res.status(500).send("College info fetch failed");
    if (!college) return res.status(404).send("College not found");

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader("Content-Disposition", "attachment; filename=form_fg.pdf");
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    let y = topMargin;
    let pageNum = 1;

    drawHeader(doc, { ...college, c_code }, college.freezed, pageNum);
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

    connection.query(sql, [c_code, c_code], (err, results) => {
      if (err) {
        console.error(err);
        doc.text("Database error");
        doc.end();
        return;
      }

      let currentBranch = null;
      let count = 1;

      results.forEach((row) => {
        const isNewBranch = currentBranch !== row.branch_name;

        if (isNewBranch) {
  currentBranch = row.branch_name;
  count = 1;

  if (y + 100 > pageHeight - 80) {
    drawFooter(doc, pageNum++);
    doc.addPage();
    drawHeader(doc, { ...college, c_code }, college.freezed, pageNum);
    y = doc.y;
  } else {
    y += 15;
  }

  doc.font("Times-Bold").fontSize(12).text(currentBranch, leftMargin, y);
  y += 20;

  drawTableHeader(doc, y);
  y += rowHeight;
}

        if (y + rowHeight > pageHeight - 50) {
          drawFooter(doc, pageNum++);
          // doc.addPage();
          drawHeader(doc, { ...college, c_code }, college.freezed, pageNum);
          y = doc.y;

          doc.font("Times-Bold").fontSize(12).text(currentBranch, leftMargin, y);
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
        doc.text("  " + row.name, x, y + 6, { width: columnWidths.name });
        x += columnWidths.name;

        doc.rect(x, y, columnWidths.quota, rowHeight).stroke();
        doc.text(quota, x, y + 6, { align: "center", width: columnWidths.quota });
        x += columnWidths.quota;

        doc.rect(x, y, columnWidths.community, rowHeight).stroke();
        doc.text(row.community, x, y + 6, { align: "center", width: columnWidths.community });
        x += columnWidths.community;

        doc.rect(x, y, columnWidths.amount, rowHeight).stroke();
        doc.text(row.Amount.toString(), x, y + 6, { align: "right", width: columnWidths.amount - 5 });

        y += rowHeight;
      });

      drawSignature(doc);
      drawFooter(doc, pageNum);
      doc.end();
    });
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
