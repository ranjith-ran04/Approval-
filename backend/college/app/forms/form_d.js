const PDFDocument = require("pdfkit");
const path = require("path");
const db = require("../config/db");
const arialBold = path.join(__dirname, "../fonts/G_ari_bd.TTF");
const arial = path.join(__dirname, "../fonts/arial.ttf");
const { footer } = require("./pageFrame");

const formd = async (req, res) => {
  var c_code;
  if (req.user.counsellingCode) {
    console.log("code", req.user.cousellingCode);
    c_code = req.user.counsellingCode;
    if (!c_code) return res.status(404).json({ msg: "collgecode not found" });
  } else {
    const name = req.user.name;
    c_code = req.body?.collegeCode;
    if (!name) return res.status(404).json({ msg: "user not found" });
  }
  try {
    const collegeQuery = `
    SELECT freezed, name_of_college, address 
    FROM college_info 
    WHERE c_code = ?
  `;

    const [collegeRows] = await db.query(collegeQuery, [c_code]);

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

    const [branches] = await db.query(branchQuery, [c_code]);

    const branchData = [];
    let pending = branches.length;

    if (pending === 0) {
      return res.status(404).send("No discontinued students found.");
    }

    branches.forEach(async (branch) => {
      const studentQuery = `
          SELECT DISTINCT REG_NO, NAME, APPROVE_STATE, TC_STATE 
          FROM discontinued_info 
          WHERE COLLCODE = ? AND BRANCH = ?
        `;

      const [students] = await db.query(studentQuery, [c_code, branch.BRANCH]);
      console.log(students);
      branchData.push({
        branch_name: branch.NAME,
        students,
      });

      pending--;
      if (pending === 0) {
        generatePDF(res, collegeInfo, branchData);
      }
    });
  } catch (err) {
    res.status(500).send("Failed to fetch college info");
  }
};

function resetCursorAfterHeader(doc) {
  doc.y = 120;
}
function generatePDF(res, collegeInfo, branchData) {
  const doc = new PDFDocument({ size: "A4", margin: 8, bufferPages: true });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=form_d.pdf");
  doc.pipe(res);
  doc.registerFont("Arial-Bold", arialBold);
  doc.registerFont("Arial", arial);

  resetCursorAfterHeader(doc);
  doc.moveDown(0.2);

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
    doc.moveDown(0.2);
    doc
      .font("Times-Bold")
      .fontSize(12)
      .text(branchGroup.branch_name.toUpperCase(), startX, doc.y, {
        align: "left",
      });
    doc.moveDown(0.5);

    let y = doc.y;
    const rowHeight = 25;
    const pageHeight = 842;
    const leftMargin = 50;
    const topMargin = 40;

    doc.font("Times-Bold").fontSize(10);
    doc.rect(startX, y, colWidths.sno, rowHeight).stroke();
    doc.rect(startX + colWidths.sno, y, colWidths.regno, rowHeight).stroke();
    doc
      .rect(
        startX + colWidths.sno + colWidths.regno,
        y,
        colWidths.name,
        rowHeight
      )
      .stroke();
    doc
      .rect(
        startX + colWidths.sno + colWidths.regno + colWidths.name,
        y,
        colWidths.approved,
        rowHeight
      )
      .stroke();
    doc
      .rect(
        startX +
          colWidths.sno +
          colWidths.regno +
          colWidths.name +
          colWidths.approved,
        y,
        colWidths.tc,
        rowHeight
      )
      .stroke();

    doc.text("S.NO", startX, y + 4, {
      width: "colWidths.sno",
      align: "center",
    });
    doc.text("REG NO", startX + colWidths.sno, y + 4, {
      width: colWidths.regno,
      align: "center",
    });
    doc.text("NAME", startX + colWidths.sno + colWidths.regno, y + 4, {
      width: colWidths.name,
      align: "center",
    });
    doc.text(
      "APPROVED\nBY DOTE",
      startX + colWidths.sno + colWidths.regno + colWidths.name,
      y + 4,
      { width: colWidths.approved, align: "center" }
    );
    doc.text(
      "TC\nAPPROVED",
      startX +
        colWidths.sno +
        colWidths.regno +
        colWidths.name +
        colWidths.approved,
      y + 4,
      { width: colWidths.tc, align: "center" }
    );

    y += rowHeight;
    doc.font("Times-Roman").fontSize(10);

    branchGroup.students.forEach((student, idx) => {
      // Check for page break
      if (y + rowHeight > doc.page.height - doc.page.margins.bottom + 1) {
        doc.addPage();
        resetCursorAfterHeader(doc);
      }

      doc.rect(startX, y, colWidths.sno, rowHeight).stroke();
      doc.rect(startX + colWidths.sno, y, colWidths.regno, rowHeight).stroke();
      doc
        .rect(
          startX + colWidths.sno + colWidths.regno,
          y,
          colWidths.name,
          rowHeight
        )
        .stroke();
      doc
        .rect(
          startX + colWidths.sno + colWidths.regno + colWidths.name,
          y,
          colWidths.approved,
          rowHeight
        )
        .stroke();
      doc
        .rect(
          startX +
            colWidths.sno +
            colWidths.regno +
            colWidths.name +
            colWidths.approved,
          y,
          colWidths.tc,
          rowHeight
        )
        .stroke();

      doc.text(`${idx + 1}`, startX + 5, y + 6);
      doc.text(student.REG_NO, startX + colWidths.sno + 5, y + 6);
      doc.text(
        student.NAME,
        startX + colWidths.sno + colWidths.regno + 5,
        y + 6
      );
      doc.text(
        student.APPROVE_STATE ? "YES" : "NO",
        startX + colWidths.sno + colWidths.regno + colWidths.name + 5,
        y + 6
      );
      doc.text(
        student.TC_STATE ? "YES" : "NO",
        startX +
          colWidths.sno +
          colWidths.regno +
          colWidths.name +
          colWidths.approved +
          5,
        y + 6
      );

      y += rowHeight;
    });

    doc.moveDown(2);
  });

  const remainingHeight = doc.page.height - doc.y - doc.page.margins.bottom;
  const extraSpaceNeeded = 150;
  if (remainingHeight < extraSpaceNeeded) {
    doc.addPage();
    resetCursorAfterHeader(doc);
  }
  footer("D", doc, collegeInfo.c_code, collegeInfo.freezed);

  doc.end();
}

module.exports = formd;
