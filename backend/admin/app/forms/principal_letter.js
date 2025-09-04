const PDFDocument = require("pdfkit");
const db = require("../config/db");
const path = require("path");
const arialBold = path.join(__dirname, "../fonts/arial/G_ari_bd.TTF");
const arial = path.join(__dirname, "../fonts/arial/arial.ttf");

const princ_let = async(req,res) => {
  const name = req.user.name;
  const c_code = req.body?.collegeCode;
  if (!name) return res.status(404).json({ msg: "user not found" });

  const [collegeRows] = await db.query(
    `SELECT name_of_college,address,letter_no,dated,p_letter_no,p_dated 
     FROM college_info WHERE c_code=?`,
    [c_code]
  );
  if (collegeRows.length === 0) {
    return res.status(404).send("College not found");
  }
  const college = collegeRows[0];

  const [branchRows] = await db.query(
    `SELECT b_code,branch_name,approved_in_take,first_year_admitted,
            discontinued,transfered_from,transfered_to,LAP
     FROM branch_info WHERE c_code=?`,
    [c_code]
  );

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=Principal_Letter_${c_code}.pdf`
  );

  const doc = new PDFDocument({ margin: 30, size: "A4", bufferPages: true });
  doc.pipe(res);

  // ================= UTILITIES =================
  function safeNum(v) {
    return v === null || v === undefined || isNaN(v) ? 0 : Number(v);
  }
  function safeVal(v) {
    if (v === null || v === undefined) return "";
    if (v instanceof Date) {
      const d = v.toISOString().split("T")[0]; // YYYY-MM-DD
      return d;
    }
    if (String(v).toLowerCase().includes("nan")) return "";
    return String(v);
  }

  // ================= HEADER =================
  doc
    .font(arialBold)
    .fontSize(15)
    .text("DEPARTMENT OF TECHNICAL EDUCATION", { align: "center" });
  doc.moveDown(3);

  const fromText =
    "From \n\nThe Commissioner\nDirectorate of Technical Education\nChennai-600 025";
  const toText = `To \n\nThe Principal\n${c_code} - ${college.name_of_college}`;

  const topY = doc.y;
  doc.font(arial).fontSize(12).text(fromText, { width: 250 });
  doc.text(toText, 370, topY, { width: 220 });
  doc.moveDown(2);
  doc.x = 30;

  // ================= BODY =================
  doc.font(arial).fontSize(12);
  doc.text("Sir/Madam,");
  doc.moveDown(0.8);

  doc
    .font(arialBold)
    .text(`Letter No : ${safeVal(college.letter_no)}`, 50, doc.y, {
      align: "left",
    })
    .text(`Dated : ${safeVal(college.dated)}`, doc.x, 245, { align: "right" });
  doc.moveDown(1);
  doc.x = 30;
  doc
    .font(arial)
    .text(
      "Sub : Technical Education - Engineering Colleges - 2025-26 - Admission to Lateral Entry Direct Second Year B.E / B.Tech Degree Courses - Verification of Original Certificates - Admission Approval Accorded - reg.",
      { align: "justify" }
    );
  doc.moveDown(0.8);

  doc.text(`Ref : (1) This Office Letter No. 16116/J1/2025, Dated: 05.09.2025`);
  doc.text(
    `         (2) Letter No. ${safeVal(college.p_letter_no)}, Dated: ${safeVal(
      college.p_dated
    )}`
  );
  doc.moveDown(0.6);
  doc
    .font(arial)
    .text("            from the Principal, ", { continued: true })
    .font(arialBold)
    .text(
      `${c_code} - ${safeVal(college.name_of_college)}, ${safeVal(
        college.address
      )}`
    );

  doc.moveDown(1);

  doc
    .font(arial)
    .text(
      `            In the letter 2nd cited, the Principal, ${c_code} - ${safeVal(
        college.name_of_college
      )} has sent the list of students admitted in Lateral Entry Direct Second Year B.E/B.Tech Degree Courses during the academic year 2025 - 2026. Admission of students have been verified with their original Certificates / allotment orders submitted by the Principal and the approval for admission is accorded as indicated below.`,
      { align: "justify" }
    );
  doc.moveDown(1);

  // ================= TABLE =================
  const headers = [
    "S.No",
    "Branch Name",
    "SAN",
    "IYR",
    "LAP",
    "DIS",
    "LE",
    "TRT",
    "TRF",
    "PER",
    "GOV",
    "MGT",
    "MIN",
    "LAP",
    "LE ADM",
    "EXC",
    "APP",
    "NAPP/PEN",
  ];
  const colWidths = [
    15, 120, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 35, 25, 25, 35,
  ];

  // Draw a row (header or data)
  function drawRow(y, row, bold = false, isHeader = false) {
    if (!Number.isFinite(y)) {
      console.error("❌ Invalid Y coordinate:", y, row);
      return 0;
    }

    let x = 20;
    let rowHeight = 0;

    if (isHeader) {
      rowHeight = 25; // fixed height for header row
    } else {
      rowHeight = 0;
      const heights = row.map((txt, i) => {
        const text = txt !== undefined && txt !== null ? String(txt) : "";
        const w = colWidths[i];
        const h = doc.heightOfString(text, { width: w - 4, align: "center" });
        rowHeight = Math.max(rowHeight, h + 6); // padding
        return h;
      });
      if (rowHeight < 20) rowHeight = 20;
    }

    const lineHeight = 10; // approx for font size 8

    for (let i = 0; i < headers.length; i++) {
      const txt = row[i] !== undefined && row[i] !== null ? row[i] : "";
      const w = colWidths[i];
      const text = String(txt);

      // Cell border
      doc.rect(x, y, w, rowHeight).stroke();

      // Text vertical placement
      let textY;
      if (isHeader) {
        textY = y + (rowHeight - lineHeight) / 2;
      } else {
        const h = doc.heightOfString(text, { width: w - 4 });
        const isMultiLine = h > lineHeight + 2;
        textY = isMultiLine ? y + 3 : y + (rowHeight - lineHeight) / 2;
      }

      doc
        .font(bold ? arialBold : arial)
        .fontSize(8)
        .text(text, x + 2, textY, { width: w - 4, align: "center" });

      x += w;
    }

    return rowHeight;
  }

  // ---- DRAW TABLE ----
  let y = doc.y + 10;
  drawRow(y, headers, true, true); // header row
  y += 25;

  let counter = 1;
  const totals = Array(headers.length).fill(0);

  for (const b of branchRows) {
    const approved = safeNum(b.approved_in_take);
    const admitted = safeNum(b.first_year_admitted);
    const discontinued = safeNum(b.discontinued);
    const trTo = safeNum(b.transfered_to);
    const trFrom = safeNum(b.transfered_from);

    const lap = approved - admitted;
    const le = Math.floor(approved / 10);
    const permitted = lap + le + discontinued + trFrom - trTo;

    const [catRows] = await db.query(
      `SELECT catogory, COUNT(*) as count FROM student_info 
       WHERE c_code=? AND b_code=? GROUP BY catogory`,
      [c_code, b.b_code]
    );
    const cats = {};
    catRows.forEach((r) => (cats[r.catogory] = r.count));

    const gov = safeNum(cats.GOVERNMENT);
    const mgt = safeNum(cats.MANAGEMENT);
    const min = safeNum(cats.MIN);
    const lp = safeNum(cats.LAP);

    const leadm = gov + mgt + min + lp;
    const exc = leadm > permitted ? leadm - permitted : 0;

    const [[{ cnt: app = 0 } = {}]] = await db.query(
      `SELECT COUNT(*) as cnt FROM student_info WHERE c_code=? AND b_code=? AND approved=1`,
      [c_code, b.b_code]
    );
    const [[{ cnt: notapp = 0 } = {}]] = await db.query(
      `SELECT COUNT(*) as cnt FROM student_info WHERE c_code=? AND b_code=? AND approved=2`,
      [c_code, b.b_code]
    );

    const row = [
      counter++,
      b.branch_name || "",
      approved,
      admitted,
      lap,
      discontinued,
      le,
      trTo,
      trFrom,
      permitted,
      gov,
      mgt,
      min,
      lp,
      leadm,
      exc,
      app,
      notapp,
    ];
    const rowHeight = drawRow(y, row);

    // check before moving y down
    if (y + rowHeight > doc.page.height - doc.page.margins.bottom - 40) {
      doc.addPage();
      y = doc.page.margins.top;
      drawRow(y, headers, true, true);
      y += 25;
    }

    y += rowHeight;

    for (let i = 2; i < row.length; i++) {
      totals[i] += safeNum(row[i]);
    }
  }

  // ---- TOTALS ----
  const totalRow = Array(headers.length).fill("");
  totalRow[1] = "TOTAL";
  for (let i = 2; i < headers.length; i++) {
    totalRow[i] = totals[i];
  }
  drawRow(y, totalRow, true);

  doc.moveDown(3);
  doc.x = 30;

  // ================= FOOTER =================
  doc
    .fontSize(10)
    .text(
      "SAN: Sanctioned Intake, DIS: Discontinued, LE: Lateral Entry, PER: Permitted, GOV: Government, MGT: Management, MIN: Minority, LAP: Lapsed, APP: Approved, NAPP/PEN: Not Approved / Pending.",
      { align: "left" }
    );
  doc.moveDown(2);

  doc
    .font(arialBold)
    .text(
      "The Admission approval order is subject to the following conditions:"
    );

  const conditions = [
    "The Institution has obtained AICTE's approval for the year 2025-2026.",
    "Grant of affiliation for all the courses by Anna University, Chennai-25, for the year 2025-2026.",
    "The Sanctioned intake is verified with Seat Matrix and found correct.",
    "Verification of student names with DOTE TNLEA web portal downloaded and found correct.",
    "The Principal has given undertaking that the Tuition fees is not collected from First Generation Tuition fees waiver students and AICTE fee waivers students.",
    "Branch transfer will not be accorded under any circumstance.",
  ];
  conditions.forEach((c, i) => {
    doc.text(`${i + 1}) ${c}`, { align: "left" });
    doc.moveDown(0.5);
  });

  doc
    .moveDown(2)
    .text("for Commissioner of Technical Education", { align: "right" });

  doc.moveDown(2).font(arialBold).text("Copy to:");
  doc.text("The Registrar, Anna University, Chennai - 600 025");
  doc.text(
    "With a request to the students to appear for the university Examinations as per the approved list"
  );

  // ================= PAGE NUMBERS =================
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(i);
    doc
      .fontSize(9)
      .text(`Page ${i + 1} of ${range.count}`, 0, 800, { align: "center" });
  }

  doc.end();
  await db.end();
};

module.exports = princ_let;