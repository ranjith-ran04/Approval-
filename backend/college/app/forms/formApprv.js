const pdf = require("pdfkit");
const db = require("../config/db");
const path = require("path");
const arialBold = path.join(__dirname, "../fonts/arial/G_ari_bd.TTF");
const arial = path.join(__dirname, "../fonts/arial/arial.ttf");
const college = require("../json/college");

function header(doc, collegeCode, approved) {

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

    // Title on the left
    // doc.font("Arial-Bold").fontSize(13).text("Second Year : 2025-2026", 20, 35);

    // Conditional right-side label
    // if (freezed === "0") {
    //     const text = "(Rough Copy)";
    //     const textWidth = doc.widthOfString(text, { font: "Arial-Bold", size: 13 });
    //     doc
    //         .font("Arial-Bold")
    //         .fontSize(13)
    //         .text(text, pageWidth - textWidth - 20, 35);
    // }

    // Centered Form title
    doc.font("Arial-Bold").fontSize(15).text(`LIST OF CANDIDATES ${approved == 1 ? 'APPROVED' : 'NOT APPROVED / PENDING'}`, 0, 32, {
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


const formApprv = async (req, res) => {
    const allot_coll_code = req.user.counsellingCode;
    // console.log(req);
    const { data: approvedFlag } = req.body;

    const pageWidth = 644 - 2 * 40; // A4 width (595pt) - 40pt margins

    // Base columns
    const scaledColumns = [
        { label: "S.No", width: 32 },
        { label: "APP_NO", width: 50 },
        { label: "REG_NO", width: 52 },
        { label: "QUOTA", width: 45 },
        { label: "NAME", width: 120 },
        { label: "NAT", width: 30 },
        { label: "COM", width: 32 },
        { label: "BOARD", width: 45 },
        { label: "OBT TOT", width: 40 },
        { label: "MAX TOT", width: 40 },
        { label: "%", width: 37 },
        { label: "FG", width: 27 },
    ];

    // Conditionally add REMARKS
    if (approvedFlag != 1) scaledColumns.push({ label: "REMARKS", width: 100 });

    // ✅ Scale widths to fit page width
    const totalWidth = scaledColumns.reduce((sum, col) => sum + col.width, 0);
    const scaleFactor = (pageWidth / totalWidth);

    const columns = scaledColumns.map(col => ({
        ...col,
        width: col.width * scaleFactor
    }));

    function TableHeader(yPosition) {
        doc.font("Arial-Bold").fontSize(9);
        let maxHeight = 0;
        columns.forEach(col => {
            const labelHeight = doc.heightOfString(col.label, {
                width: col.width - 2 * padding,
                align: "center"
            });
            if (labelHeight > maxHeight) {
                maxHeight = labelHeight
            };

        });
        maxHeight += 2 * padding;
        // console.log(maxHeight)
        // console.log(maxHeight)
        let x = doc.page.margins.left;
        columns.forEach(col => {
            doc.rect(x + 10, yPosition, col.width, maxHeight).stroke();
            doc.text(col.label, x + padding + 10, yPosition + padding, {
                width: col.width - 2 * padding,
                align: "center"
            });
            x += col.width;
        });

        return yPosition + maxHeight;
    }
    function drawDataRow(row, serial, yPosition) {
        const totalObt = row.obt_1 + row.obt_2 + row.obt_3 + row.obt_4 +
            row.obt_5 + row.obt_6 + row.obt_7 + row.obt_8;
        const totalMax = row.max_1 + row.max_2 + row.max_3 + row.max_4 +
            row.max_5 + row.max_6 + row.max_7 + row.max_8;
        const aggr = totalMax > 0 ? ((totalObt / totalMax) * 100).toFixed(2) : "0.00";

        // Build row data with explicit Q_EXAM sub-columns
        const rowData = [
            serial,
            row.APP_NO,
            row.REG_NO,
            row.QUOTA,
            row.NAME,
            row.NAT,
            row.COM,
            row.BOARD,
            totalObt,   // goes under OBT
            totalMax,   // goes under MAX
            aggr,
            row.fg == 1 ? "Y" : "N",
        ];

        if (approvedFlag != 1) rowData.push(row.remarks);

        doc.font("Arial").fontSize(9);
        let x = doc.page.margins.left + 10;
        const rowHeight = 35;
        const nameColumnIndex = 4;
        const nameText = String(rowData[nameColumnIndex]);
        const nameColumnWidth = columns[nameColumnIndex].width - 2 * padding;
        const nameHeight = doc.heightOfString(nameText, {
            width: nameColumnWidth,
            align: "center"
        });
        const dynamicRowHeight = Math.max(rowHeight, nameHeight + 10);

        rowData.forEach((data, idx) => {
            let colWidth;


            // Special handling for Q_EXAM (OBT + MAX)
            if (columns[idx].label === "Q_EXAM") {
                // Skip — handled by sub-columns
                return;
            } else if (columns[idx].label === "OBT") {
                colWidth = 50; // must match sub-column width
            } else if (columns[idx].label === "MAX") {
                colWidth = 50; // must match sub-column width
            } else {
                colWidth = columns[idx].width;
            }

            // Draw cell
            doc.rect(x, yPosition - 4.5, colWidth, dynamicRowHeight).stroke();
            doc.text(String(data).length == 0 ? "-":String(data), x + padding, yPosition + 5, {
                width: colWidth - 2 * padding,
                align: "center"
            });
            x += colWidth;
        });

        return yPosition + dynamicRowHeight;
    }



    const query = `SELECT branch_name,a_no as APP_NO ,univ_reg_no as REG_NO,catogory as QUOTA,name AS NAME,nativity AS NAT,name_of_board AS BOARD,community AS COM,fg AS FG,
    obt_1,max_1,obt_2,max_2,obt_3,max_3,obt_4,max_4,
    obt_5,max_5,obt_6,max_6,obt_7,max_7,obt_8,max_8,remarks from (select b_code,branch_name from branch_info where c_code=?)
    as branch_info,(select b_code,a_no,univ_reg_no,catogory,name,nativity,name_of_board,community,fg,obt_1,max_1,obt_2,max_2,obt_3,max_3,
    obt_4,max_4,obt_5,max_5,obt_6,max_6,obt_7,max_7,obt_8,max_8,remarks,approved from student_info 
    where c_code=?) as student_info where student_info.b_code=branch_info.b_code and student_info.approved in (?,?) order by branch_name;`;
    var result;
    var values;



    if (approvedFlag == 1) {
        values = [allot_coll_code, allot_coll_code, 1, 1]
    } else {
        values = [allot_coll_code, allot_coll_code, 0, 2];
    }

    try {
        [result] = await db.query(query, values);
    } catch (error) {
        console.log(error);

        return res.status(500).json({ msg: "query error" });
    }
    if (result.length == 0) return res.status(500).json({ msg: "Student Not found" });

    const data = result[0];
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${allot_coll_code} - Form ${approvedFlag == 1 ? "Approved" : "Not Approved"}.pdf"`);
    // res.send(data);
    const doc = new pdf({ size: "A4", margin: 8, bufferPages: true });
    doc.pipe(res)
    // doc.fontSize(14).text("hii");
    doc.registerFont("Arial-Bold", arialBold);
    doc.registerFont("Arial", arial);
    header(doc, allot_coll_code, approvedFlag);

    const padding = 3;
    let currentY = doc.y;


    let currentbranch = "";
    let serial = 1;

    result.forEach((row, index) => {
        const isNewBranch = currentbranch !== row.branch_name;

        const nameColumnIndex = 4;
        const nameText = String(row.name);
        const nameColumnWidth = columns[nameColumnIndex].width - 2 * padding;
        const nameheight = doc.heightOfString(nameText, {
            width: nameColumnWidth,
            align: "center"
        });
        const rowHeight = Math.max(30, nameheight + 10);

        if (isNewBranch) {
            const headingHeight = 20;
            const tableHeaderHeight = 30;
            const totalRequired = headingHeight + tableHeaderHeight + rowHeight;

            if (currentY + totalRequired + 30 > doc.page.height - doc.page.margins.bottom) {
                doc.addPage();
                header(doc, allot_coll_code, approvedFlag);
                currentY = doc.y;
            }

            doc.font("Arial-Bold").fontSize(12).text(
                row.branch_name.toUpperCase(),
                doc.page.margins.left + 10,
                currentY + 10
            );

            currentY = TableHeader(currentY + 40) + 5;
            currentbranch = row.branch_name;
        }

        if (!isNewBranch && currentY + rowHeight + 30 > doc.page.height - doc.page.margins.bottom) {
            doc.addPage();
            header(doc, allot_coll_code, approvedFlag);

            doc.font("Arial-Bold").fontSize(12).text(
                row.branch_name.toUpperCase(),
                doc.page.margins.left + 10,
                doc.y + 10
            );
            currentY = TableHeader(doc.y + 40) + 5;
        }

        currentY = drawDataRow(row, serial, currentY);
        serial++;
    });

    const remainingHeight = doc.page.height - currentY - doc.page.margins.bottom;
    const extraSpaceNeeded = 150;
    if (remainingHeight < extraSpaceNeeded) {
        doc.addPage();
        // header("TNLEA", doc, allot_coll_code);
    }
    footer(doc);

    doc.end();

}

module.exports = formApprv