const PDFDocument = require("pdfkit");
const db = require("../config/db");
const path = require("path");
const arialBold = path.join(__dirname, "../fonts/arial/G_ari_bd.TTF");
const arial = path.join(__dirname, "../fonts/arial/arial.ttf");
const branchCode = require("../json/branch");
const { footer } = require("./pageFrame");

async function formb(req, res) {
  var collegeCode;
  if (req.user.counsellingCode) {
    // console.log("code", req.user.cousellingCode);
    collegeCode = req.user.counsellingCode;
    if (!collegeCode)
      return res.status(404).json({ msg: "collgecode not found" });
  } else {
    const name = req.user.name;
    collegeCode = req.body?.collegeCode;
    if (!name) return res.status(404).json({ msg: "user not found" });
  }
  const query = `SELECT( (obt_1 + obt_2 + obt_3 + obt_4 + obt_5 + obt_6 + obt_7 + obt_8)/ 
      (max_1 + max_2 + max_3 + max_4 + max_5 + max_6 + max_7 + max_8)) 
      * 100 AS average, si.b_code AS branch, si.a_no AS appln_no, si.univ_reg_no AS reg_no, 
    si.name AS name,si.catogory as category, si.nationality AS nat, si.community AS com, 
    si.name_of_board AS board, si.obt_1, si.max_1, si.obt_2, si.max_2, si.obt_3, si.max_3, si.obt_4, 
    si.max_4, si.obt_5, si.max_5, si.obt_6, si.max_6, si.obt_7, si.max_7, si.obt_8, si.max_8, si.fg AS fg,
    si.aicte_tfw AS afw FROM student_info si WHERE si.c_code = ?;`;
  var result;

  function resetCursorAfterHeader(doc) {
    doc.y = 120;
  }

  try {
    [result] = await db.query(query, [collegeCode]);
    [collegeRows] = await db.query(
      "SELECT freezed FROM college_info WHERE c_code = ?",
      [collegeCode]
    );
  } catch (err) {
    return res.status(500).json({ msg: "Error in query" , sqlErr : err});
  }

  const freezed = collegeRows.length ? collegeRows[0].freezed : "0";

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'inline; filename="formb.pdf"');
  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margin: 8,
    bufferPages: true,
  });
  doc.pipe(res);
  doc.registerFont("Arial-Bold", arialBold);
  doc.registerFont("Arial", arial);
  resetCursorAfterHeader(doc);

  const studentsByBranch = result.reduce((acc, student) => {
    const branch = student.branch;
    if (!acc[branch]) acc[branch] = [];
    acc[branch].push(student);
    return acc;
  }, {});
  const columnWidths = {
    SNO: 26,
    APP_NO: 40,
    REG_NO: 47,
    QUOTA: 37,
    NAME: 96,
    NAT: 33,
    COM: 28,
    BOARD: 40,
    SEM: 50,
    PERCENT: 30,
    FG: 30,
    // AFW: 25,
  };
  const sems = [
    "SEM-1",
    "SEM-2",
    "SEM-3",
    "SEM-4",
    "SEM-5",
    "SEM-6",
    "SEM-7",
    "SEM-8",
  ];

  function tableheader() {
    let y = doc.y;
    let x = 16;
    let headerHeight = 20;

    [
      { label: "S.NO", width: columnWidths.SNO },
      { label: "APP_NO", width: columnWidths.APP_NO },
      { label: "REG_NO", width: columnWidths.REG_NO },
      { label: "QUOTA", width: columnWidths.QUOTA },
      { label: "NAME", width: columnWidths.NAME },
      { label: "NAT", width: columnWidths.NAT },
      { label: "COM", width: columnWidths.COM },
      { label: "BOARD", width: columnWidths.BOARD },
    ].forEach((item) => {
      drawCell(item.label, x, y, item.width, headerHeight * 2, false);
      x += item.width;
    });

    sems.forEach((sem) => {
      drawCell(sem, x, y, columnWidths.SEM, headerHeight, false);
      x += columnWidths.SEM;
    });

    [
      { label: "%", width: columnWidths.PERCENT },
      { label: "FG", width: columnWidths.FG },
      // { label: "AFW", width: columnWidths.AFW },
    ].forEach((item) => {
      drawCell(item.label, x, y, item.width, headerHeight * 2, false);
      x += item.width;
    });

    x =
      16 +
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
      drawCell("OBT", x, semY, columnWidths.SEM / 2, headerHeight, false);
      drawCell(
        "MAX",
        x + columnWidths.SEM / 2,
        semY,
        columnWidths.SEM / 2,
        headerHeight,
        false
      );
      x += columnWidths.SEM;
    });
  }
  function drawCell(text, x, y, width, height, font) {
    let textHeight = doc.heightOfString(text, {
      width: width - 4,
      align: "center",
    });
    let yOffset = y + (height - textHeight) / 2;
    if (text === "S.NO") {
      yOffset += 12;
    }
    doc.rect(x, y, width, height).stroke();
    doc
      .font(font ? "Arial" : "Arial-Bold")
      .fontSize(8)
      .text(text, x + 2, yOffset, {
        width: width - 4,
        height: height - 5,
        align: "center",
      });
  }

  Object.entries(studentsByBranch).forEach(([branchCodeKey, students]) => {
    const branchName = branchCode.get(branchCodeKey) || "Unknown Branch";
    if (
      doc.y + doc.heightOfString(branchName) >
        doc.page.height - doc.page.margins.bottom - 30 ||
      doc.y +
        doc.heightOfString(branchName) +
        50 +
        doc.heightOfString(students[0].name.toString(), {
          width: columnWidths.NAME - 4,
          align: "center",
        }) >
        doc.page.height - doc.page.margins.bottom - 30
    ) {
      doc.addPage();
      resetCursorAfterHeader(doc);
    }
    doc.moveDown();
    doc
      .font("Arial-Bold")
      .fontSize(13)
      .text(`${branchCodeKey} - ${branchName}`, 16);
    doc.moveDown();
    tableheader();
    let y = doc.y + 5;
    students.forEach((student, index) => {
      let rowHeight =
        doc.heightOfString(student.name.toString(), {
          width: columnWidths.NAME - 4,
          align: "center",
        }) + 10;
      let boardHeight =
        doc.heightOfString(student.board.toString(), {
          width: columnWidths.BOARD - 4,
          align: "center",
        }) + 10;
        let appHeight =  doc.heightOfString(student.appln_no.toString(), {
          width: columnWidths.BOARD - 4,
          align: "center",
        }) + 10;
        let natHeight = doc.heightOfString(student.nat.toString(), {
          width: columnWidths.BOARD - 4,
          align: "center",
        }) + 15;
        rowHeight = Math.max(rowHeight,boardHeight,appHeight,natHeight);
      drawStudentRow(student, index, rowHeight, y);
      y += rowHeight;
    });
    doc.moveDown();
    function drawStudentRow(student, index, rowHeight) {
      let x = 16;
      if (doc.y + rowHeight > doc.page.height - doc.page.margins.bottom - 30) {
        doc.addPage();
        resetCursorAfterHeader(doc);
        tableheader();
        y = doc.y + 5;
      }

      const fields = [
        { key: "SNO", value: index + 1 },
        { key: "APP_NO", value: student.appln_no },
        { key: "REG_NO", value: student.reg_no },
        { key: "QUOTA", value: student.category === "GOVERNMENT" ? "GOVT" : "MANT" },
        { key: "NAME", value: student.name },
        { key: "NAT", value: student.nat },
        { key: "COM", value: student.com },
        { key: "BOARD", value: student.board },
      ];

      fields.forEach((item) => {
        drawCell(
          String(item.value),
          x,
          y,
          columnWidths[item.key],
          rowHeight,
          true
        );
        x += columnWidths[item.key];
      });

      sems.forEach((sem, i) => {
        const obt = student[`obt_${i + 1}`] ?? 0;
        const max = student[`max_${i + 1}`] ?? 0;
        drawCell(String(obt), x, y, columnWidths.SEM / 2, rowHeight, true);
        drawCell(
          String(max),
          x + columnWidths.SEM / 2,
          y,
          columnWidths.SEM / 2,
          rowHeight,
          true
        );
        x += columnWidths.SEM;
      });

      drawCell(
        String(student.average).slice(0, 5),
        x,
        y,
        columnWidths.PERCENT,
        rowHeight,
        true
      );
      x += columnWidths.PERCENT;

      drawCell(student.fg ? "Y" : "N", x, y, columnWidths.FG, rowHeight, true);
      x += columnWidths.FG;

      // drawCell(
      //   student.afw ? "Y" : "N",
      //   x,
      //   y,
      //   columnWidths.AFW,
      //   rowHeight,
      //   true
      // );
    }
  });
  const remainingHeight = doc.page.height - doc.y - doc.page.margins.bottom;
  const extraSpaceNeeded = 150;
  if (remainingHeight < extraSpaceNeeded) {
    doc.addPage();
  }
  footer("B", doc, collegeCode, freezed);
  // console.log("form b completed");

  doc.end();
}

module.exports = formb;