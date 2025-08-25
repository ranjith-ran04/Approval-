const college = require("../json/college");

function header(doc, collegeCode,freezed, list, approved) {
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
  const pageWidth = doc.page.width;

  if (freezed === "0") {
    const text = "(Rough Copy)";
    const textWidth = doc.widthOfString(text, { font: "Arial-Bold", size: 13 });
    doc
      .font("Arial-Bold")
      .fontSize(13)
      .text(text, pageWidth - textWidth - 20, 35);
  }

  doc.font("Arial-Bold").fontSize(15).text('TNLEA 2024-2025 B.E/B.TECH', 0, 32, {
    align: "center",
    width: pageWidth,
  });

  doc.moveDown();
  var string='';
  list.map((item,i)=>{
    if(i == list.length-1){
      string = string+item?.toUpperCase();
    }else{
    string = string+item?.toUpperCase()+' / ';
  }
  })
    doc.fontSize(14).text(`${string} CATEGORY (${approved?'Approved':'Not Approved'})`, doc.page.margins.left, undefined, {
    align: "center",
    width: pageWidth,
  });
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
  const pageCount = doc.bufferedPageRange().count;

  for (let i = 0; i < pageCount; i++) {
    doc.switchToPage(i);
    doc
      .fontSize(10)
      .fillColor("gray")
      .text(`Page ${i + 1} of ${pageCount}`, 0, doc.page.height - 30, {
        align: "center",
      });
  }
}

module.exports = { header, footer };
