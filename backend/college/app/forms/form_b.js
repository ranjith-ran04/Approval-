const PDFDocument = require("pdfkit");
const db = require("../config/db");
const path = require("path");
const arialBold = path.join(__dirname, "../fonts/G_ari_bd.TTF");
const arial = path.join(__dirname, "../fonts/arial.ttf");
const college = require("../json/college");
const branch = require("../json/branch");

function formb(req, res) {
  const { collegeCode } = req.body;
  const query = `SELECT ta.avg AS average, si.b_code AS branch, si.a_no AS appln_no, si.univ_reg_no AS reg_no, si.name AS name, si.nationality AS nat, si.community AS com, si.name_of_board AS board, si.obt_1, si.max_1, si.obt_2, si.max_2, si.obt_3, si.max_3, si.obt_4, si.max_4, si.obt_5, si.max_5, si.obt_6, si.max_6, si.obt_7, si.max_7, si.obt_8, si.max_8, si.fg AS fg, si.aicte_tfw AS afw FROM total_allotted ta JOIN student_info si ON ta.reg_no = si.a_no WHERE si.c_code = ? ORDER BY ta.avg;`;

  db.query(query, [collegeCode], (err, result) => {
    if (err) {
      return res.status(500).json({ msg: "Error in query" });
    }
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="formb.pdf"');
    console.log(result);
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 10,
    });
    const collegeName =
      college.get(collegeCode.toString()) || "Unknown College";
    doc.pipe(res);
    doc.registerFont("Arial-Bold", arialBold);
    doc.registerFont("Arial", arial);
    header("B",doc,collegeCode,collegeName);
    const studentsByBranch = result.reduce((acc, student) => {
      const branch = student.branch;
      if (!acc[branch]) acc[branch] = [];
      acc[branch].push(student);
      return acc;
    }, {});
    console.log(studentsByBranch);

    function tableheader() {
      let y = doc.y;
      let x = 18;

      const columnWidths = {
        SNO: 25,
        APP_NO: 49,
        REG_NO: 49,
        QUOTA: 38,
        NAME: 88,
        NAT: 28,
        COM: 28,
        BOARD: 40,
        SEM: 50,
        PERCENT: 20,
        FG: 20,
        AFW: 25,
      };

      const sems = [
        "SEM_1",
        "SEM_2",
        "SEM_3",
        "SEM_4",
        "SEM_5",
        "SEM_6",
        "SEM_7",
        "SEM_8",
      ];

      function drawCell(text, x, y, width, height) {
        doc.rect(x, y, width, height).stroke();
        doc.fontSize(9).text(text, x + 2, y + 5, {
          width: width - 4,
          height: height - 4,
          align: "center",
        });
      }

      x = 16;
      let headerHeight = 20;

      [
        { label: "S.No", width: columnWidths.SNO },
        { label: "APP_NO", width: columnWidths.APP_NO },
        { label: "REG_NO", width: columnWidths.REG_NO },
        { label: "QUOTA", width: columnWidths.QUOTA },
        { label: "NAME", width: columnWidths.NAME },
        { label: "NAT", width: columnWidths.NAT },
        { label: "COM", width: columnWidths.COM },
        { label: "BOARD", width: columnWidths.BOARD },
      ].forEach((item) => {
        drawCell(item.label, x, y, item.width, headerHeight * 2);
        x += item.width;
      });

      sems.forEach((sem) => {
        drawCell(sem, x, y, columnWidths.SEM, headerHeight);
        x += columnWidths.SEM;
      });

      [
        { label: "%", width: columnWidths.PERCENT },
        { label: "FG", width: columnWidths.FG },
        { label: "AFW", width: columnWidths.AFW },
      ].forEach((item) => {
        drawCell(item.label, x, y, item.width, headerHeight * 2);
        x += item.width;
      });

      x =
        15.9 +
        columnWidths.SNO +
        columnWidths.APP_NO +
        columnWidths.REG_NO +
        columnWidths.QUOTA +
        columnWidths.NAME +
        columnWidths.NAT +
        columnWidths.COM +
        columnWidths.BOARD;

      let semY = y + headerHeight;

      sems.forEach(() => {
        drawCell("obt", x, semY, columnWidths.SEM / 2, headerHeight);
        drawCell(
          "max",
          x + columnWidths.SEM / 2,
          semY,
          columnWidths.SEM / 2,
          headerHeight
        );
        x += columnWidths.SEM;
      });
    }

    function drawStudentRow(student, y, index) {
      let x = 20;
      const rowHeight = 20;

      const fields = [
        { key: "SNO", value: index + 1 },
        { key: "APP_NO", value: student.appln_no },
        { key: "REG_NO", value: student.reg_no },
        { key: "QUOTA", value: "GOVT" },
        { key: "NAME", value: student.name },
        { key: "NAT", value: student.nat },
        { key: "COM", value: student.com },
        { key: "BOARD", value: student.board },
      ];

      fields.forEach((item) => {
        drawCell(String(item.value), x, y, columnWidths[item.key], rowHeight);
        x += columnWidths[item.key];
      });

      sems.forEach((sem, i) => {
        const obt = student[`obt_${i + 1}`] ?? 0;
        const max = student[`max_${i + 1}`] ?? 0;
        drawCell(String(obt), x, y, columnWidths.SEM / 2, rowHeight);
        drawCell(
          String(max),
          x + columnWidths.SEM / 2,
          y,
          columnWidths.SEM / 2,
          rowHeight
        );
        x += columnWidths.SEM;
      });

      drawCell(String(student.percent), x, y, columnWidths.PERCENT, rowHeight);
      x += columnWidths.PERCENT;

      drawCell(student.fg ? "Y" : "N", x, y, columnWidths.FG, rowHeight);
      x += columnWidths.FG;

      drawCell(student.afw ? "Y" : "N", x, y, columnWidths.AFW, rowHeight);
    }

    Object.entries(studentsByBranch).forEach((branch) => {
      const students = studentsByBranch[branch];
      // const branchName = branch.get(branch) || "unknown";

      let y = doc.y;
      doc.font("Arial-Bold").fontSize(10).text("CS");
    });
    doc.end();
  });
}
function header(c,doc,collegeCode,collegeName) {
  doc
    .rect(
      doc.page.margins.left,
      doc.page.margins.top,
      doc.page.width - doc.page.margins.left - doc.page.margins.right,
      doc.page.height - doc.page.margins.top - doc.page.margins.bottom
    )
    .stroke();
  doc.moveDown();
  doc.font("Arial-Bold").fontSize(15).text("FORM-B", { align: "center" });
  let y = doc.y;
  doc.moveDown();
  doc
    .moveTo(390, 45)
    .lineTo(390 + doc.widthOfString(`FORM-${c}`), 45)
    .stroke();
  doc.fontSize(14).text(`${collegeCode} - ${collegeName}`, {
    align: "center",
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
  });
  doc.moveDown();
  doc.font("Arial").fontSize(13).text("Second Year : 2024-2025", 30);
  doc.moveDown();
}

module.exports = { formb, header };
