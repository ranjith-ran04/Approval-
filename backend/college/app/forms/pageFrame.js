const college = require("../json/college");

<<<<<<< HEAD
function header(c, doc, collegeCode) {
=======
function header(c, doc, collegeCode, freezed) {
>>>>>>> 51d74f161c2401dbe4c9f719c371648fd551158b
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
<<<<<<< HEAD
  doc.font("Arial-Bold").fontSize(13).text("Second Year : 2024-2025", 20, 35);
  doc.font("Arial-Bold").fontSize(13).text("(Rough Copy)", 735, 35);
  doc.fontSize(15).text(`FORM-${c}`, 0, 32, { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text(`${collegeCode} - ${collegeName}`, {
    align: "center",
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 3,
  });
  doc.moveDown();
}

function footer(doc){
=======
  const pageWidth = doc.page.width;

  // Title on the left
  doc.font("Arial-Bold").fontSize(13).text("Second Year : 2024-2025", 20, 35);

  // Conditional right-side label
  if (freezed === "0") {
    const text = "(Rough Copy)";
    const textWidth = doc.widthOfString(text, { font: "Arial-Bold", size: 13 });
    doc
      .font("Arial-Bold")
      .fontSize(13)
      .text(text, pageWidth - textWidth - 20, 35);
  }

  // Centered Form title
  doc.font("Arial-Bold").fontSize(15).text(`FORM-${c}`, 0, 32, {
    align: "center",
    width: pageWidth,
  });

  doc.moveDown();
  doc
    .fontSize(14)
    .text(`${collegeCode} - ${collegeName}`, doc.page.margins.left, undefined, {
      align: "center",
      width:
        doc.page.width - doc.page.margins.left - doc.page.margins.right - 2,
    });

  doc.moveDown();
}

function footer(doc) {
>>>>>>> 51d74f161c2401dbe4c9f719c371648fd551158b
  const pageCount = doc.bufferedPageRange().count;

  for (let i = 0; i < pageCount; i++) {
    doc.switchToPage(i);

    const pageWidth = doc.page.width;
<<<<<<< HEAD
    const y = doc.page.height - 130;
=======
    const y = doc.page.height - 80;
>>>>>>> 51d74f161c2401dbe4c9f719c371648fd551158b
    const margin = 50;

    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    if (i === pageCount - 1) {
      const dateText = `Date: ${formattedDate}`;
      const sealText = "College Seal";
      const signText = "Signature of Principal";

      doc.fontSize(12).fillColor("black");

      doc.text(dateText, margin, y);

      doc.text(sealText, pageWidth / 2 - doc.widthOfString(sealText) / 2, y);

      const signWidth = doc.widthOfString(signText);
      doc.text(signText, pageWidth - margin - signWidth, y);
    }

    doc
      .fontSize(10)
      .fillColor("gray")
      .text(`Page ${i + 1} of ${pageCount}`, 0, doc.page.height - 30, {
        align: "center",
      });
  }
}

<<<<<<< HEAD
module.exports = { header,footer };
=======
module.exports = { header, footer };
>>>>>>> 51d74f161c2401dbe4c9f719c371648fd551158b
