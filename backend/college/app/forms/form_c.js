const pdf = require("pdfkit");
const db = require("../config/db");
const path = require("path");
const arialBold = path.join(__dirname, "../fonts/arial/G_ari_bd.TTF");
const arial = path.join(__dirname, "../fonts/arial/arial.ttf");
const { footer } = require("./pageFrame");

async function formc(req, res) {
  var collegeCode;
  if (req.user.counsellingCode) {
    // console.log('code',req.user.cousellingCode);
    collegeCode = req.user.counsellingCode;
    if (!collegeCode)
      return res.status(404).json({ msg: "collgecode not found" });
  } else {
    const name = req.user.name;
    collegeCode = req.body?.collegeCode;
    if (!name) return res.status(404).json({ msg: "user not found" });
  }
  var branches;
  try {
    [branches] = await db.query(
      "SELECT b_code, branch_name, approved_in_take FROM branch_info WHERE c_code = ?",
      [collegeCode]
    );
  } catch (err) {
    return res.status(500).json({ msg: "error in query" });
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'inline; filename="formc.pdf"');

  const doc = new pdf({
    size: "A4",
    layout: "landscape",
    margin: 8,
    bufferPages: true,
  });

  doc.pipe(res);
  doc.registerFont("Arial-Bold", arialBold);
  doc.registerFont("Arial", arial);
  var collegeRows;
  try {
    [collegeRows] = await db.query(
      "SELECT freezed FROM college_info WHERE c_code = ?",
      [collegeCode]
    );
  } catch (err) {
    return res.status(500).json({ msg: "error in query" });
  }
  const freezed = collegeRows.length ? collegeRows[0].freezed : "0";

  const tableTop = 120;
  const widths = [
    25, // S.No
    160, // Branch Name
    30, // SAN
    // Each community → M (35) + F (35)
    35,
    35, // OC
    35,
    35, // BC
    35,
    35, // BCM
    35,
    35, // MBC
    35,
    35, // SC
    35,
    35, // SCA
    35,
    35, // ST
    30, // Total
  ];

  const startX = (doc.page.width - widths.reduce((a, b) => a + b, 0)) / 2;

  const communities = ["OC", "BC", "BCM", "MBC", "SC", "SCA", "ST"];

  function drawTableHeader(y) {
    const heights = [18, 17]; // Main and sub-header heights
    let x = startX;
    const labels = ["S.No", "Branch Name", "SAN", ...communities, "Total"];

    let wi = 0;
    labels.forEach((label, i) => {
      if (i < 3 || i === labels.length - 1) {
        // Full-height columns: S.No, Branch Name, SAN, Total
        const cellWidth = widths[wi++];
        doc.rect(x, y, cellWidth, heights[0] + heights[1]).stroke();
        doc
          .font("Arial-Bold")
          .fontSize(9)
          .text(label, x, y + 12, {
            width: cellWidth,
            align: "center",
            height: heights[0] + heights[1],
          });
        x += cellWidth;
      } else {
        // Communities → M/F sub-columns
        const totalWidth = widths[wi] + widths[wi + 1];
        doc.rect(x, y, totalWidth, heights[0]).stroke();
        doc
          .font("Arial-Bold")
          .fontSize(9)
          .text(label, x, y + 4, {
            width: totalWidth,
            align: "center",
          });

        // M
        doc.rect(x, y + heights[0], widths[wi], heights[1]).stroke();
        doc.text("M", x, y + heights[0] + 3.5, {
          width: widths[wi],
          align: "center",
        });
        x += widths[wi++];

        // F
        doc.rect(x, y + heights[0], widths[wi], heights[1]).stroke();
        doc.text("F", x, y + heights[0] + 3.5, {
          width: widths[wi],
          align: "center",
        });
        x += widths[wi++];
      }
    });

    return y + heights[0] + heights[1];
  }

  function drawRow(row, y, bold = false) {
    const font = bold ? "Arial-Bold" : "Arial";
    const fontSize = 9;
    const cellHeight = 47;

    doc.font(font).fontSize(fontSize);

    let x = startX;
    row.forEach((val, i) => {
      const width = widths[i];
      const cellText = val?.toString() ?? "-";

      // Calculate text height
      const textOptions = {
        width: width - 4,
        align: "center",
      };
      const textHeight = doc.heightOfString(cellText, textOptions);

      // Center text vertically
      const textY = y + (cellHeight - textHeight) / 2;

      // Draw cell box
      doc.rect(x, y, width, cellHeight).stroke();

      // Draw text
      doc.text(cellText, x + 2, textY, {
        ...textOptions,
        ellipsis: true,
      });

      x += width;
    });
  }

  let y = drawTableHeader(tableTop);

  let slno = 1;
  const totals = Array(widths.length).fill(0);

  for (const b of branches) {
    var stuRows;
    try {
      [stuRows] = await db.query(
        `SELECT community, gender, COUNT(*) as count 
         FROM student_info 
         WHERE c_code = ? AND b_code = ? 
         GROUP BY community, gender`,
        [collegeCode, b.b_code]
      );
    } catch (err) {
      return res.status(500).json({ msg: "error in query" });
    }

    const counts = {};
    for (const c of communities) counts[c] = { MALE: 0, FEMALE: 0 };

    stuRows.forEach((r) => {
      if (counts[r.community]) {
        counts[r.community][r.gender] = r.count;
      }
    });

    const row = [slno++, b.branch_name, b.approved_in_take];
    for (const c of communities) {
      row.push(counts[c].MALE || 0, counts[c].FEMALE || 0);
    }

    const total = communities.reduce(
      (sum, c) => sum + (counts[c].MALE || 0) + (counts[c].FEMALE || 0),
      0
    );
    row.push(total);

    if (y > doc.page.height - 100) {
      doc.addPage();
      y = drawTableHeader(tableTop);
    }

    drawRow(row, y);
    y += 47;

    totals[2] += b.approved_in_take;
    for (let i = 3; i < row.length; i++) totals[i] += row[i];
  }

  const totalRow = ["", "TOTAL", totals[2], ...totals.slice(3)];
  if (y > doc.page.height - 100) {
    doc.addPage();
    y = drawTableHeader(tableTop);
  }
  drawRow(totalRow, y, true);

  const remainingHeight = doc.page.height - doc.y - doc.page.margins.bottom;
  const extraSpaceNeeded = 150;
  if (remainingHeight < extraSpaceNeeded) {
    doc.addPage();
  }

  footer("C", doc, collegeCode, freezed);
  doc.end();
}

module.exports = formc;
