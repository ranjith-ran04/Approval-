const pdf = require("pdfkit");
const db = require("../config/db");
const path = require("path");
const arialBold = path.join(__dirname, "../fonts/G_ari_bd.TTF");
const arial = path.join(__dirname, "../fonts/arial.ttf");
const { header, footer } = require("./pageFrame");

function forma(req, res) {
  const { collegeCode } = req.body;

  if (!collegeCode) {
    return res.status(400).json({ error: "collegeCode is required" });
  }

  const query =
    "select b.b_code, b.branch_name, b.approved_in_take, b.first_year_admitted, b.discontinued, b.transfered_from, b.transfered_to from branch_info b where b.c_code=?";

  db.query(query, [collegeCode], async (err, branches) => {
    if (err) {
      res.status(500).json({ error: err });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="formb.pdf"');

    const doc = new pdf({
      size: "A4",
      layout: "landscape",
      margin: 8,
      bufferPages: true,
    });
    doc.pipe(res);
    doc.registerFont("Arial-Bold", arialBold);
    doc.registerFont("Arial", arial);

    const [collegeRows] = await db
      .promise()
      .query("SELECT freezed FROM college_info WHERE c_code = ?", [
        collegeCode,
      ]);

    const freezed = collegeRows.length ? collegeRows[0].freezed : "0";

    header("A", doc, collegeCode, freezed);

    const tableTop = 120;
    const columns = [
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
      "NRI",
      "GOI",
      "FOR",
      "LE ADM",
      "EXC",
      "FG OTH",
      "FG SC/SCA",
      "FG ST",
    ];
    const widths = [
      25, 160, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 34, 34, 39,
      34, 39, 39, 34,
    ];
    const tableWidth = widths.reduce((a, b) => a + b, 0);
    const startX = (doc.page.width - tableWidth) / 2;

    function drawTableHeader(y) {
      columns.forEach((val, i) => {
        const x = startX + widths.slice(0, i).reduce((a, b) => a + b, 0);
        doc.rect(x, y, widths[i], 31).stroke();
        const lines =
          doc.font("Arial-Bold").fontSize(9).widthOfString(val) / widths[i];

        const lineHeight = 11;
        const numLines = Math.ceil(lines);
        const textHeight = numLines * lineHeight;
        const textY = y + (31 - textHeight) / 2;

        doc
          .font("Arial-Bold")
          .fontSize(9)
          .text(val, x + 2, textY, {
            width: widths[i] - 4, // margin
            align: "center",
          });
      });
    }

    function drawRow(row, y, bold = false) {
      row.forEach((val, i) => {
        const x = startX + widths.slice(0, i).reduce((a, b) => a + b, 0);
        const cellWidth = widths[i];
        const cellHeight = 47;

        doc.rect(x, y, cellWidth, cellHeight).stroke();

        const text = val !== undefined && val !== null ? val.toString() : "-";

        const fontName = bold ? "Arial-Bold" : "Arial";
        doc.font(fontName).fontSize(9);

        const lines =
          doc.widthOfString(text, { width: cellWidth - 4 }) / cellWidth;
        const lineHeight = 13;
        const numLines = Math.ceil(lines);
        const textHeight = numLines * lineHeight;
        const textY = y + (cellHeight - textHeight) / 2;

        doc
          .font(fontName)
          .fontSize(9)
          .text(text, x + 2, textY, {
            width: cellWidth - 4,
            align: "center",
          });
      });
    }

    let y = tableTop;
    drawTableHeader(y);
    y += 31;

    let slno = 1;
    const totals = Array(columns.length).fill(0);

    for (const b of branches) {
      const lap = b.approved_in_take - b.first_year_admitted;
      const le = Math.floor(b.approved_in_take / 10);
      const permitted =
        lap + le + b.discontinued - b.transfered_to + b.transfered_from;

      const [catRows] = await db
        .promise()
        .query(
          "select catogory,count(*) as count from student_info where c_code=? and b_code=? group by catogory",
          [collegeCode, b.b_code]
        );
      const cat = {};
      catRows.forEach((r) => (cat[r.catogory] = r.count));

      const gov = cat.GOVERNMENT || 0,
        mgt = cat.MANAGEMENT || 0,
        min = cat.MIN || 0,
        goi = cat.GOI || 0,
        fr = cat.FOR || 0,
        nri = cat.NRI || 0,
        lp = cat.LAP || 0;

      const leadm = gov + mgt + min + goi + fr + nri + lp;
      const exc = 0;

      const [fgRows] = await db
        .promise()
        .query(
          "select community,count(*) as count from student_info where c_code=? and b_code=? and fg=1 group by community",
          [collegeCode, b.b_code]
        );
      const fg = { SC: 0, SCA: 0, ST: 0, OTH: 0 };
      fgRows.forEach((r) => {
        if (["SC", "SCA"].includes(r.community)) fg.SC += r.count;
        else if (r.community === "ST") fg.ST += r.count;
        else fg.OTH += r.count;
      });

      const row = [
        slno++,
        b.branch_name,
        b.approved_in_take,
        b.first_year_admitted,
        lap,
        b.discontinued,
        le,
        b.transfered_to,
        b.transfered_from,
        permitted,
        gov,
        mgt,
        min,
        lp,
        nri,
        goi,
        fr,
        leadm,
        exc,
        fg.OTH,
        fg.SC,
        fg.ST,
      ];

      if (y > doc.page.height - 100) {
        doc.addPage();
        header("A", doc, collegeCode, freezed);
        drawTableHeader(tableTop);
        y = tableTop + 31;
      }

      drawRow(row, y, false);
      y += 47;

      for (let i = 2; i < row.length; i++) {
        totals[i] += Number(row[i]) || 0;
      }
    }

    const totalRow = [];
    totalRow[0] = "";
    totalRow[1] = "TOTAL";
    for (let i = 2; i < totals.length; i++) {
      totalRow[i] = totals[i];
    }

    if (y > doc.page.height - 100) {
      doc.addPage();
      drawTableHeader(tableTop);
      y = tableTop + 31;
    }

    drawRow(totalRow, y, true);

    const remainingHeight = doc.page.height - doc.y - doc.page.margins.bottom;
    const extraSpaceNeeded = 150;
    if (remainingHeight < extraSpaceNeeded) {
      doc.addPage();
      header("A", doc, collegeCode, freezed);
    }

    footer(doc, collegeCode);

    doc.end();
  });
}

module.exports = forma;
