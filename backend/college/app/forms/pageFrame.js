const college = require("../json/college");
function header(c, doc, collegeCode) {
  const collegeName = college.get(collegeCode.toString()) || "Unknown College";
  doc
    .rect(
      doc.page.margins.left,
      doc.page.margins.top,
      doc.page.width - doc.page.margins.left - doc.page.margins.right,
      doc.page.height - doc.page.margins.top - doc.page.margins.bottom
    )
    .stroke();
  doc.moveDown();
  doc.font("Arial-Bold").fontSize(13).text("Second Year : 2024-2025", 16,35);
  doc.fontSize(15).text(`FORM-${c}`,0,32,{ align: "center" });
  doc.moveDown();
  doc.fontSize(14).text(`${collegeCode} - ${collegeName}`, {
    align: "center",
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right-3,
  });
  doc.moveDown();
}

module.exports = { header };
