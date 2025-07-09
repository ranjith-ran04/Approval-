const express = require("express");
const mysql = require("mysql2");
const PDFDocument = require("pdfkit");
const cors = require("cors");

const app = express();
app.use(cors());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Vishnu12*#",
  database: "approval_2025",
});

// Constants
const columnWidths = {
  sno: 40,
  applno: 90,
  name: 170,
  quota: 60,
  community: 60,
  amount: 60,
};
const rowHeight = 25;
const topMargin = 40;
const leftMargin = 40;
const pageHeight = 842;

// Helper: Draw header
function drawTableHeader(doc, y) {
  doc.font("Times-Bold").fontSize(11);

  doc.rect(leftMargin, y, columnWidths.sno, rowHeight).stroke();
  doc.text("S.no", leftMargin, y + 7, {
    align: "center",
    width: columnWidths.sno,
  });

  doc.rect(leftMargin + columnWidths.sno, y, columnWidths.applno, rowHeight).stroke();
  doc.text("Applno", leftMargin + columnWidths.sno, y + 7, {
    align: "center",
    width: columnWidths.applno,
  });

  doc.rect(leftMargin + columnWidths.sno + columnWidths.applno, y, columnWidths.name, rowHeight).stroke();
  doc.text("Name", leftMargin + columnWidths.sno + columnWidths.applno, y + 7, {
    align: "center",
    width: columnWidths.name,
  });

  doc.rect(leftMargin + columnWidths.sno + columnWidths.applno + columnWidths.name, y, columnWidths.quota, rowHeight).stroke();
  doc.text("Quota", leftMargin + columnWidths.sno + columnWidths.applno + columnWidths.name, y + 7, {
    align: "center",
    width: columnWidths.quota,
  });

  doc.rect(leftMargin + columnWidths.sno + columnWidths.applno + columnWidths.name + columnWidths.quota, y, columnWidths.community, rowHeight).stroke();
  doc.text("Community", leftMargin + columnWidths.sno + columnWidths.applno + columnWidths.name + columnWidths.quota, y + 7, {
    align: "center",
    width: columnWidths.community,
  });

  doc.rect(leftMargin + columnWidths.sno + columnWidths.applno + columnWidths.name + columnWidths.quota + columnWidths.community, y, columnWidths.amount, rowHeight).stroke();
  doc.text("Amount", leftMargin + columnWidths.sno + columnWidths.applno + columnWidths.name + columnWidths.quota + columnWidths.community, y + 7, {
    align: "center",
    width: columnWidths.amount,
  });
}

app.get("/generate-pdf", (req, res) => {
  const doc = new PDFDocument({ margin: 40, size: "A4" });
  const filename = "form_fg.pdf";
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
  res.setHeader("Content-Type", "application/pdf");
  doc.pipe(res);

  // Header
  const c_code = "1";
  const collegeName =
    "University Departments of Anna University, Chennai - CEG Campus, Sardar Patel Road, Guindy, Chennai 600 025";
  const address = "SARDAR PATEL ROAD, GUINDY, CHENNAI - 600 025";

  doc.font("Times-Bold").fontSize(16).text("FORM-FG", { align: "center" });
  doc.font("Times-Roman").fontSize(12).text("(Rough Copy)", { align: "right" });
  doc.moveDown();
  doc.font("Times-Bold").fontSize(13).text(`${c_code} - ${collegeName}`, {
    align: "center",
    underline: true,
  });
  doc.font("Times-Roman").fontSize(12).text(address, { align: "center" });
  doc.moveDown().font("Times-Roman").fontSize(12).text("SECOND YEAR : 2024 - 2025", {
    align: "left",
  });
  doc.moveDown();

  let y = doc.y;
  drawTableHeader(doc, y);
  y += rowHeight;

  const sql = `SELECT Amount, branch_name, a_no, name, catogory, community 
    FROM (
      SELECT b_code, branch_name FROM branch_info WHERE c_code = ?
    ) AS b
    JOIN (
      SELECT Amount, b_code, a_no, name, catogory, community FROM student_info 
      WHERE c_code = ? AND fg = 1 AND (Amount >= 0)
    ) AS s ON b.b_code = s.b_code 
    ORDER BY branch_name`;

  connection.query(sql, [c_code, c_code], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error generating PDF");
      return;
    }

    let currentBranch = null;
    let count = 1;

    results.forEach((row) => {
      if (row.branch_name !== currentBranch) {
        currentBranch = row.branch_name;

        // Check space before section heading
        if (y + rowHeight > pageHeight - 60) {
          doc.addPage();
          y = topMargin;
          drawTableHeader(doc, y);
          y += rowHeight;
        }

        doc.font("Times-Bold").fontSize(12).text(currentBranch, leftMargin, y);
        y += 20;
        count = 1;
      }

      // Check page overflow before student row
      if (y + rowHeight > pageHeight - 60) {
        doc.addPage();
        y = topMargin;
        drawTableHeader(doc, y);
        y += rowHeight;
      }

      doc.font("Times-Roman").fontSize(11);

      doc.rect(leftMargin, y, columnWidths.sno, rowHeight).stroke();
      doc.text(count++, leftMargin, y + 7, {
        align: "center",
        width: columnWidths.sno,
      });

      doc.rect(leftMargin + columnWidths.sno, y, columnWidths.applno, rowHeight).stroke();
      doc.text(row.a_no, leftMargin + columnWidths.sno, y + 7, {
        align: "center",
        width: columnWidths.applno,
      });

      doc.rect(leftMargin + columnWidths.sno + columnWidths.applno, y, columnWidths.name, rowHeight).stroke();
      doc.text(row.name, leftMargin + columnWidths.sno + columnWidths.applno + 5, y + 7);

      doc.rect(leftMargin + columnWidths.sno + columnWidths.applno + columnWidths.name, y, columnWidths.quota, rowHeight).stroke();
      doc.text(row.catogory === "GOVERNMENT" ? "GOVT" : "MNGT", leftMargin + columnWidths.sno + columnWidths.applno + columnWidths.name + 5, y + 7);

      doc.rect(leftMargin + columnWidths.sno + columnWidths.applno + columnWidths.name + columnWidths.quota, y, columnWidths.community, rowHeight).stroke();
      doc.text(row.community, leftMargin + columnWidths.sno + columnWidths.applno + columnWidths.name + columnWidths.quota + 5, y + 7);

      doc.rect(leftMargin + columnWidths.sno + columnWidths.applno + columnWidths.name + columnWidths.quota + columnWidths.community, y, columnWidths.amount, rowHeight).stroke();
      doc.text(row.Amount.toString(), leftMargin + columnWidths.sno + columnWidths.applno + columnWidths.name + columnWidths.quota + columnWidths.community + 5, y + 7);

      y += rowHeight;
    });

    doc.end();
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
