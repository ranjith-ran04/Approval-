const PDFDocument = require("pdfkit");
const path = require("path");
const arialBold = path.join(__dirname, "../fonts/G_ari_bd.TTF");
const arial = path.join(__dirname, "../fonts/arial.ttf");
const { header, footer } = require("./pageFrame"); 

const express = require("express");
const mysql = require("mysql2");
const PDFDocument = require("pdfkit");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Vishnu12*#",
  database: "approval_2025",
});

connection.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err.message);
  } else {
    console.log("Connected to MySQL");
  }
});

app.post("/form-d", (req, res) => {
  const c_code = req.body.c_code?.trim();
  if (!c_code) return res.status(400).send("College code is required.");

  const collegeQuery = `
    SELECT freezed, name_of_college, address 
    FROM college_info 
    WHERE c_code = ?
  `;

  connection.query(collegeQuery, [c_code], (err, collegeRows) => {
    if (err || collegeRows.length === 0) {
      return res.status(500).send("Failed to fetch college info");
    }

    const collegeInfo = {
      c_code,
      name_of_college: collegeRows[0].name_of_college,
      address: collegeRows[0].address,
      freezed: collegeRows[0].freezed,
    };

    const branchQuery = `
      SELECT DISTINCT b.BRANCH, b.NAME 
      FROM branches b
      WHERE b.BRANCH IN (
        SELECT DISTINCT BRANCH FROM discontinued_info WHERE COLLCODE = ?
      )
      ORDER BY b.BRANCH
    `;

    connection.query(branchQuery, [c_code], (err, branches) => {
      if (err) return res.status(500).send("Failed to fetch branch data");

      const branchData = [];
      let pending = branches.length;

      if (pending === 0) {
        return res.status(404).send("No discontinued students found.");
      }

      branches.forEach((branch) => {
        const studentQuery = `
          SELECT DISTINCT REG_NO, NAME, APPROVE_STATE, TC_STATE 
          FROM discontinued_info 
          WHERE COLLCODE = ? AND BRANCH = ?
        `;

        connection.query(studentQuery, [c_code, branch.BRANCH], (err, students) => {
          if (err) students = [];

          branchData.push({
            branch_name: branch.NAME,
            students,
          });

          pending--;
          if (pending === 0) {
            generatePDF(res, collegeInfo, branchData);
          }
        });
      });
    });
  });
});

function generatePDF(res, collegeInfo, branchData) {
  const doc = new PDFDocument({ size: "A4", margin: 30 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=form_d.pdf");
  doc.pipe(res);

//   doc.font("Times-Roman").fontSize(14).text("FORM-D DISCONTINUED DETAILS", { align: "center" });
//   if (!collegeInfo.freezed) {
//     doc.fontSize(14).text("(Rough Copy)", { align: "right" });
//   }

//   doc.moveDown();
//   doc.fontSize(14).text(`${collegeInfo.c_code} - ${collegeInfo.name_of_college}`, { align: "center" });
//   doc.moveDown(0.5);
//   doc.fontSize(12).text(collegeInfo.address, { align: "center" });
//   doc.moveDown(1);
//   doc.text("LATERAL ENTRY : 2024 - 2025", { align: "left" });
//   doc.moveDown();

  const startX = 30;
  const colWidths = {
    sno: 50,
    regno: 120,
    name: 170,
    approved: 100,
    tc: 100,
  };

  branchData.forEach((branchGroup) => {
    // doc.addPage();
    doc.moveDown(0.5);
    doc.font("Times-Bold").fontSize(12).text(branchGroup.branch_name.toUpperCase(), startX, doc.y, { align: "left" });
    doc.moveDown(0.5);

    let y = doc.y;
    const rowHeight = 28;

    doc.font("Times-Bold").fontSize(10);
    doc.rect(startX, y, colWidths.sno, rowHeight).stroke();
    doc.rect(startX + colWidths.sno, y, colWidths.regno, rowHeight).stroke();
    doc.rect(startX + colWidths.sno + colWidths.regno, y, colWidths.name, rowHeight).stroke();
    doc.rect(startX + colWidths.sno + colWidths.regno + colWidths.name, y, colWidths.approved, rowHeight).stroke();
    doc.rect(startX + colWidths.sno + colWidths.regno + colWidths.name + colWidths.approved, y, colWidths.tc, rowHeight).stroke();

    doc.text("S.NO", startX + 5, y + 6, {align: "center"});
    doc.text("REG NO", startX + colWidths.sno + 5, y + 6, {align: "center"});
    doc.text("NAME", startX + colWidths.sno + colWidths.regno + 5, y + 6, {align: "center"});
    doc.text("APPROVED\nBY DOTE", startX + colWidths.sno + colWidths.regno + colWidths.name + 5, y + 3, {align: "center"});
    doc.text("TC\nAPPROVED", startX + colWidths.sno + colWidths.regno + colWidths.name + colWidths.approved + 5, y + 3, {align: "center"});

    y += rowHeight;
    doc.font("Times-Roman").fontSize(10);

    branchGroup.students.forEach((student, idx) => {
      // Check for page break
      if (y + rowHeight > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
        y = doc.y;
      }

      doc.rect(startX, y, colWidths.sno, rowHeight).stroke();
      doc.rect(startX + colWidths.sno, y, colWidths.regno, rowHeight).stroke();
      doc.rect(startX + colWidths.sno + colWidths.regno, y, colWidths.name, rowHeight).stroke();
      doc.rect(startX + colWidths.sno + colWidths.regno + colWidths.name, y, colWidths.approved, rowHeight).stroke();
      doc.rect(startX + colWidths.sno + colWidths.regno + colWidths.name + colWidths.approved, y, colWidths.tc, rowHeight).stroke();

      doc.text(`${idx + 1}`, startX + 5, y + 6);
      doc.text(student.REG_NO, startX + colWidths.sno + 5, y + 6);
      doc.text(student.NAME, startX + colWidths.sno + colWidths.regno + 5, y + 6);
      doc.text(student.APPROVE_STATE ? "YES" : "NO", startX + colWidths.sno + colWidths.regno + colWidths.name + 5, y + 6);
      doc.text(student.TC_STATE ? "YES" : "NO", startX + colWidths.sno + colWidths.regno + colWidths.name + colWidths.approved + 5, y + 6);

      y += rowHeight;
    });

    doc.moveDown(2);
  });

  // Signature Page
//   doc.addPage();
//   doc.moveDown(2);
//   doc.font("Times-Roman").fontSize(11.5);
//   doc.text(
//     'This is to certify that the above students have discontinued the course from our institution and TC has been issued to the above students marked with "Discontinued". Further it is verified that on any account the above students will not be readmitted in our institution in future since their vacancies have been added for filling up of students during Lateral Entry 2024-2025',
//     { align: "justify" }
//   );

//   doc.moveDown(2);
//   const today = new Date().toLocaleDateString("en-GB");
//   doc.text(`Date: ${today}`, 30);
//   doc.text("College Seal", 260);
//   doc.text("Signature Field", 420);

const remainingHeight = doc.page.height - doc.y - doc.page.margins.bottom;
    const extraSpaceNeeded = 150;
    if (remainingHeight < extraSpaceNeeded) {
      doc.addPage();
      header("B", doc, collegeCode);
    }
    footer(doc);

  doc.end();
}

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
