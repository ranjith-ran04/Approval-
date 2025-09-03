const PDFDocument = require("pdfkit");
const db = require("../config/db");
const path = require("path");

const arialBold = path.join(__dirname, "../../../college/app/fonts/arial/G_ari_bd.TTF");
const arial= path.join(__dirname, "../../../college/app/fonts/arial/arial.ttf");

async function noteOrderPending(req, res) {
    
  try {
    const collegeCode = req.body.collegeCode;

    // === Fetch College Info ===
    const [collegeRow] = await db.query(
      "SELECT name_of_college, address, letter_no, dated FROM college_info WHERE c_code = ?",
      [collegeCode]
    );

    const collegeName = collegeRow.name_of_college;
    const letterNo = collegeRow.letter_no;
    const dated = collegeRow.dated;

    // === Setup PDF ===
    const doc = new PDFDocument({ size: "A4", margin: 30 });
    doc.registerFont("Arial", arial);
    doc.registerFont("Arial-Bold", arialBold);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=Form_Not_Appr.pdf");
    doc.pipe(res);

    // === Header ===
    doc.font("Arial-Bold").fontSize(12).text("DIRECTORATE OF TECHNICAL EDUCATION : : CHENNAI 600 025", { align: "center" });
    doc.text("ADMISSION TO LATERAL ENTRY DIRECT SECOND YEAR B.E / B.TECH DEGREE COURSES 2024-25", { align: "center" });
    doc.moveDown(0.5);
    doc.font("Arial").fontSize(10)
       .text(`ANNEXURE TO LETTER NO: ${letterNo}     DATED: ${dated}`, { align: "center" });
    doc.moveDown(0.5);
    doc.font("Arial-Bold").text("LIST OF CANDIDATES NOT APPROVED / PENDING", { align: "center" });
    doc.text(`${collegeCode} - ${collegeName}`, { align: "center" });
    doc.moveDown(1);

    // === Table Header ===
    const tableTop = doc.y;
    const colWidths = [25, 60, 60, 60, 30, 30, 40, 40, 40, 40, 40]; 
    const headers = [
      "S.No", "APP_NO", "REG_NO", "QUOTA", "NAME", "NAT", "COM",
      "BOARD", "Q_EXAM OBT", "Q_EXAM MAX", "%"
    ];

    drawRow(doc, tableTop, headers, colWidths, true);

    // === Fetch Branches ===
    const [branches] = await db.query(
      "SELECT b_code, branch_name FROM branch_info WHERE c_code = ?",
      [collegeCode]
    );

    let counter = 1;
    for (const branch of branches) {
      const [students] = await db.query(
        "SELECT a_no, univ_reg_no, catogory, name, nativity, community, name_of_board, obt_1,max_1,obt_2,max_2,obt_3,max_3,obt_4,max_4,obt_5,max_5,obt_6,max_6,obt_7,max_7,obt_8,max_8,fg,pms,reason " +
        "FROM student_info WHERE c_code = ? AND b_code = ? AND approved = 2",
        [collegeCode, branch.b_code]
      );

      if (students.length === 0) continue;

      doc.moveDown(0.5);
      doc.font("Arial-Bold").fontSize(11).text(branch.branch_name, { underline: true });

      students.forEach((stu) => {
        const totalObt = stu.obt_1 + stu.obt_2 + stu.obt_3 + stu.obt_4 + stu.obt_5 + stu.obt_6 + stu.obt_7 + stu.obt_8;
        const totalMax = stu.max_1 + stu.max_2 + stu.max_3 + stu.max_4 + stu.max_5 + stu.max_6 + stu.max_7 + stu.max_8;
        const percentage = totalMax > 0 ? ((totalObt / totalMax) * 100).toFixed(2) : "0.00";

        const row = [
          counter,
          stu.a_no,
          stu.univ_reg_no,
          stu.catogory === "GOVERNMENT" ? "GOVT" : stu.catogory === "MANAGEMENT" ? "MNGT" : stu.catogory,
          stu.name,
          stu.nativity === "OTHERS" ? "OTH" : stu.nativity,
          stu.community,
          stu.name_of_board === "UNIVERSITY" ? "UNIV" : stu.name_of_board === "AUTONNOMOUS" ? "AUTO" : stu.name_of_board,
          totalObt,
          totalMax,
          percentage,
        ];
        drawRow(doc, doc.y, row, colWidths, false);
        counter++;
      });
    }

    // === Totals ===
    doc.moveDown(2);
    doc.font("Arial").fontSize(12).text(`a) TOTAL NUMBER OF STUDENTS ADMITTED : ....`, { continued: false });
    doc.text(`b) TOTAL NUMBER OF STUDENTS APPROVED : ....`);
    doc.text(`c) TOTAL NUMBER OF STUDENTS NOT APPROVED / PENDING : ....`);

    // Footer
    doc.moveDown(5);
    doc.text("L.O. / CTE", { align: "center" });

    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generating PDF" });
  }
}

// === Helper to Draw Table Rows ===
function drawRow(doc, y, row, widths, header = false) {
  doc.font(header ? "Arial-Bold" : "Arial").fontSize(8);
  row.forEach((text, i) => {
    doc.text(String(text), { continued: true, width: widths[i], align: "center" });
  });
  doc.moveDown(0.3);
}

module.exports = { noteOrderPending };
