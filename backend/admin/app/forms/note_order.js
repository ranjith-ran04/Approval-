import express from "express";
import mysql from "mysql2/promise";
import PDFDocument from "pdfkit";

// --- Setup Express ---
const app = express();
app.use(express.json());

// --- DB connection pool ---
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "yourpassword",
  database: "yourdb",
});

// --------- Helpers ---------
function toFixed(n) {
  return Math.round(Number(n) || 0);
}

function drawCellBorder(doc, x, y, w, h) {
  doc.rect(x, y, w, h).stroke();
}

function fitMultiLineText(doc, text, x, y, w, h, align = "left", fontSize = 9, font = "Times-Roman") {
  doc.save();
  doc.font(font).fontSize(fontSize);
  doc.text(String(text ?? ""), x + 2, y + 3, {
    width: w - 4,
    align,
  });
  doc.restore();
}

function ensureSpace(doc, neededHeight, marginBottom = 40) {
  const pageBottom = doc.page.height - marginBottom;
  if (doc.y + neededHeight > pageBottom) {
    doc.addPage();
  }
}

// --------- Async PDF Generator ---------
async function generateFormDPdf(c_code, res) {
  let conn;
  try {
    conn = await pool.getConnection();

    // --- College info ---
    const [clgRows] = await conn.query(
      `SELECT name_of_college, address, letter_no, dated, p_letter_no, p_dated
       FROM college_info
       WHERE c_code = ?`,
      [c_code]
    );
    if (clgRows.length === 0) throw new Error("College not found for given c_code");
    const detail = clgRows[0];

    // --- Branch rows ---
    const [branchRows] = await conn.query(
      `SELECT b_code, branch_name, approved_in_take, first_year_admitted,
              discontinued, transfered_from, transfered_to, LAP
       FROM branch_info
       WHERE c_code = ?
       ORDER BY b_code`,
      [c_code]
    );

    // Prepare totals
    const tot = {
      approved_in_take: 0,
      first_year_admitted: 0,
      discontinued: 0,
      transfered_from: 0,
      transfered_to: 0,
      LAP: 0,
      LAP1: 0,
      lateral_entry: 0,
      permitted: 0,
      lateral_entry_admitted: 0,
      GOVERNMENT: 0,
      MANAGEMENT: 0,
      MIN: 0,
      NRI: 0,
      GOI: 0,
      FOR: 0,
      EXC: 0,
    };

    let totapp = 0;
    let totnotapp = 0;
    const computedRows = [];

    for (const row of branchRows) {
      const b_code = row.b_code;

      // Approved / Not approved counts
      const [[appRow]] = await conn.query(
        `SELECT COUNT(*) AS cnt FROM student_info WHERE c_code=? AND b_code=? AND approved=1`,
        [c_code, b_code]
      );
      const app = Number(appRow?.cnt || 0);
      totapp += app;

      const [[notAppRow]] = await conn.query(
        `SELECT COUNT(*) AS cnt FROM student_info WHERE c_code=? AND b_code=? AND approved=2`,
        [c_code, b_code]
      );
      const notapp = Number(notAppRow?.cnt || 0);
      totnotapp += notapp;

      // Category bucket counts
      const [catRows] = await conn.query(
        `SELECT catogory, COUNT(*) AS cnt
         FROM student_info
         WHERE c_code=? AND b_code=?
         GROUP BY catogory`,
        [c_code, b_code]
      );

      const temp = {
        GOVERNMENT: 0,
        MANAGEMENT: 0,
        MIN: 0,
        NRI: 0,
        GOI: 0,
        FOR: 0,
        EXC: 0,
        LAP: 0,
      };
      for (const c of catRows) {
        if (temp.hasOwnProperty(c.catogory)) {
          temp[c.catogory] = Number(c.cnt || 0);
        }
      }

      // Totals add
      tot.approved_in_take += Number(row.approved_in_take || 0);
      tot.first_year_admitted += Number(row.first_year_admitted || 0);
      tot.transfered_to += Number(row.transfered_to || 0);
      tot.transfered_from += Number(row.transfered_from || 0);
      tot.discontinued += Number(row.discontinued || 0);

      const lateral_entry = toFixed((Number(row.approved_in_take || 0)) / 10);
      let lap = Number(row.approved_in_take || 0) - Number(row.first_year_admitted || 0);
      if (lap < 0) lap = 0;
      tot.LAP1 += lap;
      tot.lateral_entry += lateral_entry;

      const permitted =
        lateral_entry +
        lap +
        Number(row.discontinued || 0) +
        Number(row.transfered_from || 0) -
        Number(row.transfered_to || 0);
      tot.permitted += permitted;

      const lateral_entry_admitted =
        Number(temp.GOVERNMENT) +
        Number(temp.MANAGEMENT) +
        Number(temp.MIN) +
        Number(temp.LAP) +
        Number(temp.GOI) +
        Number(temp.NRI) +
        Number(temp.FOR);
      tot.lateral_entry_admitted += lateral_entry_admitted;

      tot.GOVERNMENT += temp.GOVERNMENT;
      tot.MANAGEMENT += temp.MANAGEMENT;
      tot.MIN += temp.MIN;
      tot.NRI += temp.NRI;
      tot.GOI += temp.GOI;
      tot.FOR += temp.FOR;
      tot.LAP += temp.LAP;

      const exc = Math.max(lateral_entry_admitted - permitted, 0);
      if (exc > 0) {
        temp.EXC = exc;
        tot.EXC += exc;
      }

      computedRows.push({
        branch_name: row.branch_name,
        SAN23: Number(row.approved_in_take || 0),
        IYR: Number(row.first_year_admitted || 0),
        LAP: lap,
        DIS: Number(row.discontinued || 0),
        LE: lateral_entry,
        TRT: Number(row.transfered_to || 0),
        TRF: Number(row.transfered_from || 0),
        PER: permitted,
        GOV: temp.GOVERNMENT,
        MGT: temp.MANAGEMENT,
        MIN: temp.MIN,
        LAP_STUD: temp.LAP,
        LE_ADM: lateral_entry_admitted,
        EXC: temp.EXC || 0,
        APP: app,
        NAPP: notapp,
      });
    }

    // Overall approved / not approved
    const [[approvedOverallRow]] = await conn.query(
      `SELECT COUNT(*) AS cnt FROM student_info WHERE c_code=? AND approved=1`,
      [c_code]
    );
    const approvedOverall = Number(approvedOverallRow?.cnt || 0);

    const [[notApprovedOverallRow]] = await conn.query(
      `SELECT COUNT(*) AS cnt FROM student_info WHERE c_code=? AND approved=2`,
      [c_code]
    );
    const notApprovedOverall = Number(notApprovedOverallRow?.cnt || 0);

    // --- PDF Start ---
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=Form_APPR.pdf");

    const doc = new PDFDocument({ size: "A4", margin: 36, bufferPages: true });
    doc.pipe(res);

    doc.font("Times-Roman").fontSize(12);

    // ===== Page 1: Header + Intro =====
    doc.text("O.N Submitted to CTE:", { align: "left" });
    doc.moveUp();
    doc.text(`FILE NO. ${detail.letter_no || ""}`, { align: "right" });

    doc.moveDown(1);
    doc.text(
      "Sub : Technical Education - Engineering Colleges - 2024-25 - Admission to Lateral Entry Direct Second Year B.E / B.Tech Degree Courses - Verification of Original Certificates - Admission Approval Accorded - reg.",
      { align: "justify" }
    );

    doc.moveDown(1);
    doc.text("Ref : (1)  This Office Letter No. 16116/J1/2024,", { continued: true });
    doc.text("Dated: 05/09/2024", { align: "right" });
    doc.moveDown(1);
    doc.text(`         (2)  Letter No. ${detail.p_letter_no || ""}`);
    doc.text(`Dated: ${detail.p_dated || ""}`, { align: "right" });
    doc.moveDown(1);
    doc.text(`               from the Principal, ${c_code} - ${detail.name_of_college}.`, { align: "center" });
    doc.moveDown(0.8);
    doc.text(
      `In the letter 2nd cited, the Principal, ${c_code} - ${detail.name_of_college} has sent the list of students admitted in Lateral Entry Direct Second Year B.E/B.Tech Degree Courses during the academic year 2024 - 2025. Admission of students have been verified with their original Certificates / allotment orders submitted by the Principal and the approval for admission is accorded as indicated below.`,
      { align: "justify" }
    );

    // ===== Table =====
    doc.moveDown(1);

    const tableLeft = 16;
    const colDefs = [
      { key: "SNO", label: "S.No", w: 20 },
      { key: "BR", label: "Branch Name", w: 100 },
      { key: "SAN23", label: "SAN -23", w: 32 },
      { key: "IYR", label: "I YR", w: 28 },
      { key: "LAP", label: "LAP", w: 27 },
      { key: "DIS", label: "DIS", w: 27 },
      { key: "LE", label: "LE", w: 27 },
      { key: "TRT", label: "TRT", w: 27 },
      { key: "TRF", label: "TRF", w: 27 },
      { key: "PER", label: "PER", w: 27 },
      { key: "GOV", label: "GOV", w: 27 },
      { key: "MGT", label: "MGT", w: 27 },
      { key: "MIN", label: "MIN", w: 27 },
      { key: "LAP_STUD", label: "LAP", w: 27 },
      { key: "LE_ADM", label: "LE ADM", w: 27 },
      { key: "EXC", label: "EXC", w: 27 },
      { key: "APP", label: "APP", w: 27 },
      { key: "NAPP", label: "NAPP/PEN", w: 35 },
    ];

    const headerHeight = 24;
    let cursorY = doc.y + 6;

    // Header row
    let x = tableLeft;
    doc.font("Times-Bold").fontSize(10);
    for (const col of colDefs) {
      drawCellBorder(doc, x, cursorY, col.w, headerHeight);
      fitMultiLineText(doc, col.label, x, cursorY, col.w, headerHeight, "center", 9, "Times-Bold");
      x += col.w;
    }
    cursorY += headerHeight;

    // Table rows
    const addRow = (rowObj, isTotal = false, sno = null) => {
      let x = tableLeft;
      const font = isTotal ? "Times-Bold" : "Times-Roman";

      const cells = [
        sno ?? "",
        rowObj.branch_name ?? "",
        rowObj.SAN23 ?? 0,
        rowObj.IYR ?? 0,
        rowObj.LAP ?? 0,
        rowObj.DIS ?? 0,
        rowObj.LE ?? 0,
        rowObj.TRT ?? 0,
        rowObj.TRF ?? 0,
        rowObj.PER ?? 0,
        rowObj.GOV ?? 0,
        rowObj.MGT ?? 0,
        rowObj.MIN ?? 0,
        rowObj.LAP_STUD ?? 0,
        rowObj.LE_ADM ?? 0,
        rowObj.EXC ?? 0,
        rowObj.APP ?? 0,
        rowObj.NAPP ?? 0,
      ];

      // compute max row height
      let maxHeight = 0;
      for (let i = 0; i < colDefs.length; i++) {
        const col = colDefs[i];
        const value = i === 1 && isTotal ? "TOTAL" : cells[i];
        const h = doc.heightOfString(String(value), {
          width: col.w - 4,
          align: "center",
        });
        if (h + 6 > maxHeight) maxHeight = h + 6;
      }

      ensureSpace(doc, maxHeight, 40);

      for (let i = 0; i < colDefs.length; i++) {
        const col = colDefs[i];
        const value = i === 1 && isTotal ? "TOTAL" : cells[i];
        drawCellBorder(doc, x, cursorY, col.w, maxHeight);
        fitMultiLineText(doc, value, x, cursorY, col.w, maxHeight, "center", 9, font);
        x += col.w;
      }

      cursorY += maxHeight;
    };

    let sno = 1;
    for (const r of computedRows) {
      addRow(r, false, sno++);
    }

    const totalRow = {
      branch_name: "TOTAL",
      SAN23: tot.approved_in_take,
      IYR: tot.first_year_admitted,
      LAP: tot.LAP1,
      DIS: tot.discontinued,
      LE: tot.lateral_entry,
      TRT: tot.transfered_to,
      TRF: tot.transfered_from,
      PER: tot.permitted,
      GOV: tot.GOVERNMENT,
      MGT: tot.MANAGEMENT,
      MIN: tot.MIN,
      LAP_STUD: tot.LAP,
      LE_ADM: tot.lateral_entry_admitted,
      EXC: tot.EXC,
      APP: totapp,
      NAPP: totnotapp,
    };
    addRow(totalRow, true, "");

    doc.moveDown(1);
    doc.font("Times-Roman").fontSize(10);

    doc.text("SAN: Sanctioned Intake, DIS: Discontinued, LE: Lateral Entry, PER: Permitted, AFW: AICTE Fee Waiver, ", 50, doc.y, { width: 500, align: "left" });
    doc.moveDown(0.5);
    doc.text("GOV: Government, MGT: Management, MIN: Minority, LAP: Lapsed, ADM total: Admitted, EX: Excess, ", 50, doc.y, { width: 500, align: "left" });
    doc.moveDown(0.5);
    doc.text("APP: Approved, NAPP/PEN: Not Approved / Pending.", 50, doc.y, { width: 500, align: "left" });

    // ===== Page 2 =====
    doc.addPage();
    doc.font("Times-Roman").fontSize(12);

    doc.text(`a) Total Number of Students Admitted                           : ${tot.lateral_entry_admitted}`);
    doc.moveDown(1);
    doc.text(`b) Total Number of Students Approved                          : ${approvedOverall}`);
    doc.moveDown(1);
    doc.text(`c) Total Number of Students Not Approved / Pending   : ${notApprovedOverall}`);
    doc.moveDown(4);

    doc.text("The Admission approval order is subject to the following conditions :");
    doc.moveDown(2);

    const bullet = (n, t) => {
      doc.text(`   ${n}) ${t}`);
      doc.moveDown(0.3);
    };

    bullet("i", "The Institution has obtained AICTE's approval for the year 2023-2024.");
    doc.moveDown(1);
    bullet("ii", "Grant of affiliation for all the courses by Anna University , Chennai-25, for the year 2023-2024.");
    doc.moveDown(1);
    bullet("iii", "The Sanctioned intake is verified with Seat Matrix and found correct.");
    doc.moveDown(1);
    bullet("iv", "Verification of student names with DOTE TNLEA web portal downloaded and found correct.");
    doc.moveDown(1);
    bullet("v", "The Principal has given undertaking that the Tuition fees is not collected from First Generation Tuition fees waiver students and AICTE fee waivers students.");
    doc.moveDown(1);
    bullet("vi", "Branch transfer will not be accorded under any circumstance.");

    doc.moveDown(0.8);
    doc.text(
      `CTE's order is requested to accord admission approval to students admitted into Lateral Entry Direct Second Year B.E / B.Tech Degree Courses for the year 2024-25 in ${c_code} - ${detail.name_of_college} as mentioned above. Subject to order, the approval list is enclosed.`,
      { align: "justify" }
    );

    doc.moveDown(2);
    doc.text("For CTE's Order please");
    doc.moveDown(4);
    doc.text("L.O.                                                   /                                                    CTE", { align: "center" });

    // --- Footer page numbers ---
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc.font("Times-Italic").fontSize(9).text(`Page ${i + 1}/${range.count}`, 0, doc.page.height - 50, {
        align: "center",
      });
    }

    doc.end();
  } catch (err) {
    console.error("Error generating PDF:", err);
    res.status(500).send("Error generating PDF");
  } finally {
    if (conn) conn.release();
  }
}

// --------- Route ---------
app.post("/form-d", async (req, res) => {
  const { c_code } = req.body || {};
  if (!c_code) return res.status(400).send("c_code is required");

  await generateFormDPdf(c_code, res);
});

// --------- Server
