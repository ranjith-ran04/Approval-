const PDF = require("pdfkit");
const db = require("../config/db");
const path = require("path");
const arialBold = path.join(__dirname, "../fonts/arial/G_ari_bd.TTF");
const arial = path.join(__dirname, "../fonts/arial/arial.ttf");

const abs_form = async(req,) => {
  const name = req.user.name;
  const collegeCode = req.body?.collegeCode;
  if (!name) return res.status(404).json({ msg: "user not found" });


  try {
    
    // 1. College info
    const collegeInfo = await db.query(
      "SELECT c_code, name_of_college, letter_no,dated FROM college_info WHERE c_code = ?",
      [collegeCode]
    );
    if (!collegeInfo.length) {
      return res.status(404).json({ error: "College not found" });
    }
    const { name_of_college, letter_no, dated } = collegeInfo[0];

    // 2. Students approved
    const approvedCount = await db.query(
      "SELECT COUNT(*) AS total FROM student_info WHERE c_code = ?",
      [collegeCode]
    );
    const totalStudents = approvedCount[0].total;

    // 3. Nativity
    const nativityRows = await db.query(
      "SELECT nativity, COUNT(*) AS count FROM student_info WHERE c_code = ? GROUP BY nativity",
      [collegeCode]
    );
    let tnCount = 0,
      osCount = 0;
    nativityRows.forEach((row) => {
      if (row.nativity === "TN") tnCount = row.count;
      else osCount += row.count;
    });

    // 4. Gender
    const genderRows = await db.query(
      "SELECT gender, COUNT(*) AS count FROM student_info WHERE c_code = ? GROUP BY gender",
      [collegeCode]
    );
    let maleCount = 0,
      femaleCount = 0;
    genderRows.forEach((row) => {
      if (row.gender === "MALE") maleCount = row.count;
      else if (row.gender === "FEMALE") femaleCount = row.count;
    });

    // 5. Community
    const commRows = await db.query(
      "SELECT community, COUNT(*) AS count FROM student_info WHERE c_code = ? GROUP BY community",
      [collegeCode]
    );
    const commMap = {
      SC: 0,
      SCA: 0,
      ST: 0,
      BC: 0,
      BCM: 0,
      MBC: 0,
      OC: 0,
    };
    commRows.forEach((row) => {
      if (commMap[row.community] !== undefined)
        commMap[row.community] = row.count;
    });

    // ---------------- PDF Creation ----------------
    const doc = new PDF({ size: "A4", layout: "portrait", margin: 30 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=abstract_form.pdf");
    doc.pipe(res);

    // Title
    doc
      .font(arialBold)
      .fontSize(14)
      .text("DIRECTORATE OF TECHNICAL EDUCATION :: CHENNAI 600 025", {
        align: "center",
      });
    doc.moveDown(1);
    doc.text(
      "ADMISSION TO LATERAL ENTRY DIRECT SECOND YEAR B.E/B.TECH DEGREE COURSES 2025-26",
      { align: "center" }
    );

    doc.moveDown(3);
    doc
      .font(arialBold)
      .fontSize(11)
      .text(`ANNEXURE TO LETTER NO : ${letter_no}`, { continued: true })
      .text(`DATED : ${dated}`, {
        align: "right",
      });

    doc.moveDown(2);
    doc.fontSize(14).text("ABSTRACT", { align: "center" });

    doc.moveDown(1);
    doc
      .font(arial)
      .fontSize(11)
      .text(`${collegeCode} - ${name_of_college}`, { align: "center" });

    doc.moveDown(2);
    doc.text(`No. of Students Approved : ${totalStudents}`, { align: "left" });

    // ---------------- Board of Study + Gender ----------------
    doc.moveDown(3);

    // Board of Study box
    // ---------------- Board of Study ----------------
    doc
      .font(arialBold)
      .fontSize(14)
      .text("Board of Study :", { continued: false });
    const startY = doc.y + 10; // a little more spacing

    const rowHeight = 30; // row height
    const col1Width = 80;
    const col2Width = 180;

    // Header row
    doc.rect(30, startY, col1Width, rowHeight).stroke();
    doc.rect(30 + col1Width, startY, col2Width, rowHeight).stroke();
    doc
      .fontSize(13)
      .text("TN", 30, startY + 8, { width: col1Width, align: "center" });
    doc.text("OS (Board Studied in OS)", 30 + col1Width, startY + 8, {
      width: col2Width,
      align: "center",
    });

    // Data row
    doc.rect(30, startY + rowHeight, col1Width, rowHeight).stroke();
    doc.rect(30 + col1Width, startY + rowHeight, col2Width, rowHeight).stroke();
    doc
      .font(arial)
      .fontSize(13)
      .text(tnCount, 30, startY + rowHeight + 8, {
        width: col1Width,
        align: "center",
      });
    doc.text(osCount, 30 + col1Width, startY + rowHeight + 8, {
      width: col2Width,
      align: "center",
    });

    // ---------------- Gender Details ----------------
    doc
      .font(arialBold)
      .fontSize(14)
      .text("Gender Details :", 350, startY - 25);

    const gColWidth = 100;

    // Header row
    doc.rect(350, startY, gColWidth, rowHeight).stroke();
    doc.rect(350 + gColWidth, startY, gColWidth, rowHeight).stroke();
    doc
      .fontSize(13)
      .text("MALE", 350, startY + 8, { width: gColWidth, align: "center" });
    doc.text("FEMALE", 350 + gColWidth, startY + 8, {
      width: gColWidth,
      align: "center",
    });

    // Data row
    doc.rect(350, startY + rowHeight, gColWidth, rowHeight).stroke();
    doc
      .rect(350 + gColWidth, startY + rowHeight, gColWidth, rowHeight)
      .stroke();
    doc
      .font(arial)
      .fontSize(13)
      .text(maleCount, 350, startY + rowHeight + 8, {
        width: gColWidth,
        align: "center",
      });
    doc.text(femaleCount, 350 + gColWidth, startY + rowHeight + 8, {
      width: gColWidth,
      align: "center",
    });

    // ---------------- Community Details ----------------
    doc.moveDown(4);
    doc.font(arialBold).fontSize(14).text("Community Details :",30,doc.y);

    const headers = ["SC", "SCA", "ST", "BC", "BCM", "MBC", "OC"];
    const cColWidth = 75;
    const cRowHeight = 30;
    const tableY = doc.y + 10;
    let x = 30;

    // Header row
    headers.forEach((h) => {
      doc.rect(x, tableY, cColWidth, cRowHeight).stroke();
      doc
        .fontSize(13)
        .text(h, x, tableY + 8, { width: cColWidth, align: "center" });
      x += cColWidth;
    });

    // Data row
    x = 30;
    headers.forEach((h) => {
      doc.rect(x, tableY + cRowHeight, cColWidth, cRowHeight).stroke();
      doc
        .font(arial)
        .fontSize(13)
        .text(commMap[h], x, tableY + cRowHeight + 8, {
          width: cColWidth,
          align: "center",
        });
      x += cColWidth;
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = abs_form ;