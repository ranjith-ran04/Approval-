const PDFDocument = require("pdfkit");
const db = require("../config/db");
const path = require("path");
const arialBold = path.join(__dirname, "../fonts/G_ari_bd.TTF");
const arial = path.join(__dirname, "../fonts/arial.ttf");
const { footer } = require("./pageFrame");

const columnWidths = {
  sno: 30,
  applno: 60,
  name: 200,
  quota: 60,
  community: 70,
  amount: 70,
};

const rowHeight = 25;
const pageHeight = 842;
const leftMargin = 50;
const topMargin = 40;

const getCollegeInfo = async (c_code) => {
  const [results] = await db.query(
    "SELECT freezed, name_of_college, address FROM college_info WHERE c_code = ?",
    [c_code]
  );
  if (results.length === 0) return null;
  return results;
};

function drawTableHeader(doc, y) {
  doc.font("Arial-Bold", arialBold).fontSize(11);
  const headers = ["S.no", "Applno", "Name", "Quota", "Community", "Amount"];
  let x = leftMargin;
  Object.entries(columnWidths).forEach(([key, width], i) => {
    doc.rect(x, y, width, rowHeight).stroke();
    doc.text(headers[i], x, y + 8, { align: "center", width });
    x += width;
  });
}

const formfg = async (req, res) => {
  let c_code;
  if (req.user.counsellingCode) {
    c_code = req.user.counsellingCode;
    if (!c_code) return res.status(404).json({ msg: "college code not found" });
  } else {
    const name = req.user.name;
    c_code = req.body?.collegeCode;
    if (!name) return res.status(404).json({ msg: "user not found" });
  }

  let college;
  try {
    college = await getCollegeInfo(c_code);
    if (!college) return res.status(404).send("College not found");
  } catch (err) {
    return res.status(500).send("College info fetch failed");
  }
  const freezed = college[0].freezed;

  const doc = new PDFDocument({ margin: 8, size: "A4", bufferPages: true });
  res.setHeader("Content-Disposition", "attachment; filename=form_fg.pdf");
  res.setHeader("Content-Type", "application/pdf");
  doc.pipe(res);
  doc.registerFont("Arial-Bold", arialBold);
  doc.registerFont("Arial", arial);

  let y = topMargin + 60; // leave space for header
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

  try {
    const [results] = await db.query(sql, [c_code, c_code]);

    let currentBranch = null;
    let count = 1;

    results.forEach((row) => {
      const isNewBranch = currentBranch !== row.branch_name;

      if (isNewBranch) {
        currentBranch = row.branch_name;
        count = 1;

        if (y + 100 > pageHeight - 50) {
          doc.addPage();
          y = topMargin + 60;
        } else {
          y += 15;
        }

        doc
          .font("Arial-Bold", arialBold)
          .fontSize(12)
          .text(currentBranch, leftMargin, y);
        y += 20;

        drawTableHeader(doc, y);
        y += rowHeight;
      }

      if (y + rowHeight > pageHeight - 50) {
        doc.addPage();
        y = topMargin + 60;

        doc
          .font("Arial-Bold", arialBold)
          .fontSize(12)
          .text(currentBranch, leftMargin, y);
        y += 20;
        drawTableHeader(doc, y);
        y += rowHeight;
      }

      const quota = row.catogory === "GOVERNMENT" ? "GOVT" : "MNGT";
      doc.font("Arial").fontSize(11);

      let x = leftMargin;

      doc.rect(x, y, columnWidths.sno, rowHeight).stroke();
      doc.text(count++, x, y + 6, { align: "center", width: columnWidths.sno });
      x += columnWidths.sno;

      doc.rect(x, y, columnWidths.applno, rowHeight).stroke();
      doc.text(row.a_no, x, y + 6, {
        align: "center",
        width: columnWidths.applno,
      });
      x += columnWidths.applno;

      doc.rect(x, y, columnWidths.name, rowHeight).stroke();
      doc.text("  " + row.name, x, y + 6, {
        align: "left",
        width: columnWidths.name,
      });
      x += columnWidths.name;

      doc.rect(x, y, columnWidths.quota, rowHeight).stroke();
      doc.text(quota, x, y + 6, { align: "center", width: columnWidths.quota });
      x += columnWidths.quota;

      doc.rect(x, y, columnWidths.community, rowHeight).stroke();
      doc.text(row.community, x, y + 6, {
        align: "center",
        width: columnWidths.community,
      });
      x += columnWidths.community;

      doc.rect(x, y, columnWidths.amount, rowHeight).stroke();
      doc.text(row.Amount.toString(), x, y + 6, {
        align: "center",
        width: columnWidths.amount - 5,
      });

      y += rowHeight;
    });
    const remainingHeight = doc.page.height - doc.y - doc.page.margins.bottom;
    const extraSpaceNeeded = 150;
    if (remainingHeight < extraSpaceNeeded) {
      doc.addPage();
    }
    // always run footer at the very end (like form A)
    footer("FG", doc, c_code, freezed);

    doc.end();
  } catch (err) {
    console.error(err);
    doc.text("Database error");
    doc.end();
    return;
  }
};

module.exports = formfg;
