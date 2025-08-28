const PDFDocument = require("pdfkit");
const db = require("../config/db");
const path = require("path");

const arialBold = path.join(__dirname, "../../../college/app/fonts/arial/G_ari_bd.TTF");
const arial= path.join(__dirname, "../../../college/app/fonts/arial/arial.ttf");

async function principal_notapproved(req, res) {
    const collegecode = 5901;
    const query1 = `select name_of_college,address,letter_no,dated,p_letter_no,p_dated from college_info where c_code=${collegecode};`;

    let result1, result2,result3,result4,resultTotal;
    try {
        [result1] = await db.query(query1, [collegecode]);
    } catch (err) {
        return res.status(500).json({ msg: "Error in query" });
    }

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    doc.pipe(res);

    const data1 = result1[0];
    doc.registerFont("Arial-Bold", arialBold);
    doc.registerFont("Arial", arial);

    // --- Top heading ---
    doc.font("Arial-Bold").fontSize(13).text(
        "DIRECTORATE OF TECHNICAL EDUCATION : : CHENNAI 600 025",
        { align: "center" }
    );
    doc.fontSize(12).text(
        "ADMISSION TO LATERAL DIRECT ENTRY SECOND YEAR B.E / B.TECH  DEGREE COURSES 2025-2026",
        { align: "center" }
    );
    doc.moveDown(0.5);
    doc.fontSize(10).text(`ANNEXURE TO LETTER NO: ${data1.letter_no}`, 40);
    doc.text(`DATED : ${data1.dated}`, 445, doc.y - 12);

    doc.moveDown(1);
    doc.fontSize(12).text("LIST OF CANDIDATES APPROVED", 40,130,{ align: "center" });
    doc.fontSize(12).text(
        `${collegecode} - ${data1.name_of_college}`,
        { align: "center" }
    );
    doc.moveDown(1);

    const query2 = `
    select a.a_no,a.univ_reg_no,a.catogory,a.name,a.nativity,a.community,a.name_of_board,
    a.qualifying_exam,a.obt_1,a.max_1,a.obt_2,a.max_2,a.obt_3,a.max_3,a.obt_4,a.max_4,
    a.obt_5,a.max_5,a.obt_6,a.max_6,a.obt_7,a.max_7,a.obt_8,a.max_8,a.fg,a.aicte_tfw,a.pms,
    b.b_code,b.branch_name
    from student_info a
    join branch_info b on a.b_code=b.b_code and a.c_code=b.c_code
    where a.c_code=${collegecode} and approved=2 order by b.b_code`;

    try {
        [result2] = await db.query(query2, [collegecode]);
    } catch (err) {
        return res.status(500).json({ msg: "Error in query" });
    }

    const columns = [
        { label: "S.NO", width: 30 },
        { label: "APP_NO", width: 50 },
        { label: "REG_NO", width: 55 },
        { label: "QUOTA", width: 45 },
        { label: "NAME",  width: 120 },
        { label: "NAT",   width: 30 },
        { label: "COMM",  width: 40 },
        { label: "BOARD", width: 40 },
        { label: `MAX`, width: 30 },
        {label:`OBT`,width:30},
        { label: "%", width: 30 },
        { label: "FG", width: 30 },
        { label: "PMSS", width: 35 }
    ];

    const padding = 3;
    function drawTableHeader(yStart) {
    const colX = [15]; 
    const headerFont = "Arial-Bold";
    const headerFontSize = 9;
    const rowHeight1 = 20;
    const rowHeight2 = 15;

    const colWidths = [
        30,  
        50,   
        55,   
        45,   
        120, 
        30,  
        40,   
        40,  
        30,   
        30,   
        30,  
        30,  
        35    
    ];

    for (let i = 0; i < colWidths.length; i++) {
        colX.push(colX[i] + colWidths[i]);
    }

    doc.font(headerFont).fontSize(headerFontSize);

    const labels1 = [
        "S.NO", "APP_NO", "REG_NO", "QUOTA", "NAME", "NAT", "COMM", "BOARD", 
        "Q_EXAM", "", "%", "FG", "PMSS"
    ];

    for (let i = 0; i < labels1.length; i++) {
        if (labels1[i] === "Q_EXAM") {
            doc.rect(colX[i], yStart, colWidths[i] + colWidths[i+1], rowHeight1).stroke();
            doc.text("Q_EXAM", colX[i], yStart + 5, {
                width: colWidths[i] + colWidths[i+1],
                align: "center"
            });
            i++; 
        } else if (labels1[i] !== "") {
            doc.rect(colX[i], yStart, colWidths[i], rowHeight1 + rowHeight2).stroke();
            doc.text(labels1[i], colX[i], yStart + 10, {
                width: colWidths[i],
                align: "center"
            });
        }
    }
    const qExamIndex = 8;
    const subHeaders = ["OBT", "MAX"];

    for (let j = 0; j < subHeaders.length; j++) {
        const x = colX[qExamIndex + j];
        doc.rect(x, yStart + rowHeight1, colWidths[qExamIndex + j], rowHeight2).stroke();
        doc.text(subHeaders[j], x, yStart + rowHeight1 + 2, {
            width: colWidths[qExamIndex + j],
            align: "center"
        });
    }

    return rowHeight1 + rowHeight2;
}


    function getRowHeight(rowData) {
        doc.font('Arial').fontSize(9);
        let maxH = 0;
        rowData.forEach((cell, idx) => {
            const h = doc.heightOfString(String(cell), {
                width: columns[idx].width - 2*padding,
                align: "center"
            });
            if (h > maxH) maxH = h;
        });
        return maxH + 2*padding;
    }

    function drawDataRow(rowData, y) {
        const rh = getRowHeight(rowData);
        let x  = 15;
        rowData.forEach((cell, idx) => {
            doc.rect(x, y-5, columns[idx].width, rh).stroke();
            doc.font('Arial').text(String(cell), x+padding, y+padding-5, {
                width: columns[idx].width - 2*padding,
                align: "center"
            });
            x += columns[idx].width;
        });
        return rh;
    }

    let currentY = doc.y;
    let currentBranch = "";
    let serial = 1;

    result2.forEach(row => {
        const totalObt = row.obt_1 + row.obt_2 + row.obt_3 + row.obt_4 +
                         row.obt_5 + row.obt_6 + row.obt_7 + row.obt_8;
        const totalMax = row.max_1 + row.max_2 + row.max_3 + row.max_4 +
                         row.max_5 + row.max_6 + row.max_7 + row.max_8;
        const aggr = totalMax > 0 ? ((totalObt / totalMax) * 100).toFixed(2) : "0.00";

        if (row.branch_name !== currentBranch) {
            if (currentY + 80 > doc.page.height - doc.page.margins.bottom) {
                doc.addPage();
                currentY = doc.y;
            }

            doc.font("Arial-Bold").fontSize(12)
               .text(row.branch_name.toUpperCase(), 10, currentY);
            currentY += 20;

            const h = drawTableHeader(currentY);
            currentY += h + 5;

            currentBranch = row.branch_name;
        }

        const rowData = [
            serial,
            row.a_no,
            row.univ_reg_no,
            row.catogory === "GOVERNMENT" ? "GOVT"
                : (row.catogory === "MANAGEMENT" ? "MNGT" : row.catogory),
            row.name,
            (row.nativity === "OTHERS" ? "OTH" : row.nativity),
            row.community,
            row.name_of_board === "UNIVERSITY"
                ? "UNIV"
                : (row.name_of_board === "AUTONOMOUS" ? "AUTO" : row.name_of_board),
            totalObt,
            totalMax,
            aggr,
            row.fg  === 1 ? "Y" : "N",
            row.pms === 1 ? "Y" : "N"
        ];

        const rh = getRowHeight(rowData);
        if (currentY + rh + 30 > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
    currentY = doc.y + 20;   
    doc.font("Arial-Bold").fontSize(12)
       .text(row.branch_name.toUpperCase(), 10, currentY);
    currentY += 25;  
    const hh = drawTableHeader(currentY);
    currentY += hh + 5;
}

        const used = drawDataRow(rowData, currentY);
        currentY += used;
        serial++;
    });
const query3 = `SELECT approved, COUNT(approved) as cnt FROM student_info WHERE c_code = ? AND approved = 1 GROUP BY approved`;
const query4 = `SELECT approved, COUNT(approved) as cnt FROM student_info WHERE c_code = ? AND approved = 2 GROUP BY approved`;
const queryTotal = `SELECT COUNT(*) as cnt FROM student_info WHERE c_code = ?`;

try {
    [result3] = await db.query(query3, [collegecode]);
    [result4] = await db.query(query4, [collegecode]);
    [resultTotal] = await db.query(queryTotal, [collegecode]);
} catch (err) {
    return res.status(500).json({ msg: "Error in query" });
}

const approvedCount = result3.length ? result3[0].cnt : 0;
const notApprovedCount = result4.length ? result4[0].cnt : 0;
const totalCount = resultTotal.length ? resultTotal[0].cnt : 0;

const rectX = 20;
const rectY = currentY;
const rectWidth = 555; 
const lineHeight = 20;
const linePadding = 10;
const numberOfLines = 3;
const rectHeight = numberOfLines * lineHeight + linePadding; 

doc.rect(rectX, rectY, rectWidth, rectHeight).stroke();

let textY = rectY + 10;
const textX = rectX + 20; 

doc.font('Arial').fontSize(10).text(`a)TOTAL NUMBER OF STUDENTS ADMITTED                : ${totalCount}`, textX, textY);
textY += lineHeight;
doc.text(`b) TOTAL NUMBER OF STUDENTS APPROVED              : ${approvedCount}`, textX, textY);
textY += lineHeight;
doc.text(`c) TOTAL NUMBER OF STUDENTS NOT APPROVED          : ${notApprovedCount}`, textX, textY);

currentY = rectY + rectHeight + 10;
doc.font('Arial-Bold').fontSize(11).text('For Commissioner of Technical Education',335,currentY+50);

    doc.end();
}

module.exports = principal_notapproved;
