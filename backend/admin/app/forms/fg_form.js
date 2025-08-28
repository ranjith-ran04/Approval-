const PDFDocument = require("pdfkit");
const db = require("../config/db");
const path = require("path");
const arialBold = path.join(__dirname, "../fonts/arial/G_ari_bd.TTF");
const arial = path.join(__dirname, "../fonts/arial/arial.ttf");
const branchCode = require("../json/branch");
const { header, footer } = require("./fg_frame");

const columnWidths = {
  SNO: 50,
  APPLN_NO: 75,
  NAME: 190,
  QUOTA: 50,
  COMMUNITY: 75,
  AMOUNT: 75,
};

const headers = [
  { key: "SNO", label: "S.NO" },
  { key: "APPLN_NO", label: "APP_NO" },
  { key: "NAME", label: "NAME" },
  { key: "QUOTA", label: "QUOTA" },
  { key: "COMMUNITY", label: "COMMUNITY" },
  { key: "AMOUNT", label: "AMOUNT" },
];

async function fg_form(req, res) {
  let collegeCode;
  var approved,list,supp;
    const name = req.user.name;
    collegeCode = req.body?.collegeCode;
    approved = req.body?.approved || false;
    list = req.body?.caste || [];
    supp = req.body?.supp || false;
    if (!name) return res.status(404).json({ msg: "user not found" });

  const query = supp? `
select a_no as appln_no,name,catogory as quota ,community,amount,b_code as branch from student_info 
where fg_approved = ${approved?1:2} and community in (?) and c_code = ? and a_no in (select reg_no from lat_stu_cv_whole_supp);`:
`select a_no as appln_no,name,catogory as quota ,community,amount,b_code as branch from student_info 
where fg_approved = ${approved?1:2} and community in (?) and c_code = ?;
  `;

  let result;
  try {
    [result] = await db.query(query, [list,collegeCode]);
    // console.log(result);
  } catch (err) {
    return res.status(500).json({ msg: "Error in query" });
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'inline; filename="formb.pdf"');

  const doc = new PDFDocument({
    size: "A4",
    layout: "portrait",
    margin: 8,
    bufferPages: true,
  });

  doc.pipe(res);
  doc.registerFont("Arial-Bold", arialBold);
  doc.registerFont("Arial", arial);
  header(doc, collegeCode,false,list,approved);

  const studentsByBranch = result.reduce((acc, student) => {
    const branch = student.branch;
    if (!acc[branch]) acc[branch] = [];
    acc[branch].push(student);
    return acc;
  }, {});

  function tableHeader() {
    let y = doc.y;
    let x = 40;
    let headerHeight = 20;

    headers.forEach((col) => {
      drawCell(col.label, x, y, columnWidths[col.key], headerHeight, false);
      x += columnWidths[col.key];
    });
  }

  function drawCell(text, x, y, width, height, font) {
    if (!width || !height) return;
    let textHeight = doc.heightOfString(text, {
      width: width - 4,
      align: "center",
    });
    let yOffset = y + (height - textHeight) / 2;
    if (text === "S.NO") yOffset += 4;

    doc.rect(x, y, width, height).stroke();
    doc
      .font(font ? "Arial" : "Arial-Bold")
      .fontSize(8)
      .text(text, x + 2, yOffset, {
        width: width - 4,
        height: height - 10,
        align: "center",
      });
  }
  if(result.length !== 0){
  Object.entries(studentsByBranch).forEach(([branchCodeKey, students]) => {
    const branchName = branchCode.get(branchCodeKey) || "Unknown Branch";

    if (
      doc.y + doc.heightOfString(branchName) >
      doc.page.height - doc.page.margins.bottom - 30
    ) {
      doc.addPage();
      header(doc, collegeCode,false,list,approved);
      doc.moveDown();
    }

    doc.moveDown();
    doc.font("Arial-Bold").fontSize(13).text(`${branchCodeKey} - ${branchName}`, 40);
    doc.moveDown();
    tableHeader();
    let y = doc.y + 5;

    students.forEach((student, index) => {
      let rowHeight =
        doc.heightOfString(student.name?.toString() || "", {
          width: columnWidths.NAME - 4,
          align: "center",
        }) + 10;

      drawStudentRow(student, index, rowHeight, y);
      y += rowHeight;
    });

    function drawStudentRow(student, index, rowHeight) {
      let x = 40;

      if (doc.y + rowHeight > doc.page.height - doc.page.margins.bottom - 30) {
        doc.addPage();
        header(doc, collegeCode,false,list,approved);
        doc.moveDown();
        tableHeader();
        y = doc.y + 5;
      }

      const row = {
        SNO: index + 1,
        APPLN_NO: student.appln_no,
        NAME: student.name,
        QUOTA: "GOVT",
        COMMUNITY: student.community,
        AMOUNT: student.amount,
      };

      headers.forEach((col) => {
        const val = row[col.key] ?? "";
        drawCell(String(val), x, y, columnWidths[col.key], rowHeight, true);
        x += columnWidths[col.key];
      });
    }
    doc.moveDown();
  });

}else{
    doc.moveDown();
    doc.font(arialBold).fontSize(15).text('NO STUDENT FOUND',{align:'center'});
}

  const remainingHeight = doc.page.height - doc.y - doc.page.margins.bottom;
  const extraSpaceNeeded = 150;
  if (remainingHeight < extraSpaceNeeded) {
    doc.addPage();
    header(doc, collegeCode,false,list,approved);
  }
  footer(doc);

  doc.end();
}

module.exports = fg_form;
