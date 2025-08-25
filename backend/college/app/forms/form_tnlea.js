const pdf = require("pdfkit");
const db = require("../config/db");
const { header,footer } = require("./pageFrame");
const path = require("path");
const arialBold = path.join(__dirname, "../fonts/arial/G_ari_bd.TTF");
const arial = path.join(__dirname, "../fonts/arial/arial.ttf");
async function form_tnlea(req,res){
    const allot_coll_code=req.user.counsellingCode;

    // console.log("received body:",req.body);
    // console.log(collegeCode);
    // console.log(collegeCode);
    const query="SELECT branch_name,a_no,name,community,fg,Availed_fg,aicte_tfw,obt_1,max_1,obt_2,max_2,obt_3,max_3,obt_4,max_4,obt_5,max_5,obt_6,max_6,obt_7,max_7,obt_8,max_8,hsc_group from (select b_code,branch_name from branch_info where c_code=?) as branch_info,(select b_code,a_no,name,community,fg,Availed_fg,aicte_tfw,obt_1,max_1,obt_2,max_2,obt_3,max_3,obt_4,max_4,obt_5,max_5,obt_6,max_6,obt_7,max_7,obt_8,max_8,hsc_group from student_info where c_code=?) as student_info where student_info.b_code=branch_info.b_code order by branch_name;"
    // const {collegeCode}=req.body;
    // console/log(collegeCode);
    var result;
    try{
    [result] = await db.query(query,[allot_coll_code,allot_coll_code]);
    // console.log(result)
    }catch(err){
           return res.status(500).json({msg:"query error"});
        }
        if(result.length==0){
            return res.status(500).json({msg:"Data not found in your table"});
        }
        else{
            const data=result[0];
            res.setHeader('Content-Type', 'form_tnlea/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${allot_coll_code}.pdf"`);
            // res.send(data);
            const doc=new pdf({size:"A4",margin:8,bufferPages:true});
            doc.pipe(res)
            // doc.fontSize(14).text("hii");
            doc.registerFont("Arial-Bold", arialBold);
            doc.registerFont("Arial", arial);
            header("TNLEA", doc, allot_coll_code);
            const columns = [
            { label: "S.NO", width: 30 },
            { label: "APPLICATION NO", width: 80 },
            { label: "NAME", width: 130 },
            { label: "COMM", width: 50 },
            { label: "FIRST GRADUATE", width: 60 },
            { label: "FEE CONSESSION", width:70 },
            { label: "AICTE TFW", width: 40 },
            { label: "AGGR %", width: 40 },
            { label: "CATEGORY", width: 60 }
        ];
const padding = 3;
let currentY = doc.y;
function TableHeader(yPosition) {
    doc.font("Arial-Bold").fontSize(9);
    let maxHeight = 0;
    columns.forEach(col=>{
        const labelHeight = doc.heightOfString(col.label, {
            width: col.width - 2 * padding,
            align: "center"
        });
        if (labelHeight > maxHeight) {
            maxHeight = labelHeight};
          
    });
    maxHeight += 2 * padding; 
    // console.log(maxHeight)
    // console.log(maxHeight)
    let x = doc.page.margins.left;
    columns.forEach(col => {
        doc.rect(x+10, yPosition, col.width, maxHeight).stroke();
        doc.text(col.label, x + padding+10, yPosition + padding, {
            width: col.width - 2 * padding,
            align: "center"
        });
        x += col.width;
    });

    return yPosition+maxHeight;
}
function drawDataRow(row, serial, yPosition) {
    const totalObt = row.obt_1 + row.obt_2 + row.obt_3 + row.obt_4 +
                     row.obt_5 + row.obt_6 + row.obt_7 + row.obt_8;
    const totalMax = row.max_1 + row.max_2 + row.max_3 + row.max_4 +
                     row.max_5 + row.max_6 + row.max_7 + row.max_8;
    const aggr = totalMax > 0 ? ((totalObt / totalMax) * 100).toFixed(2) : "0.00";

    const rowData = [
        serial,
        row.a_no,
        row.name,
        row.community,
        row.fg === 1 ? "YES" : "NO",
        row.Availed_fg === 1 ?"YES":"NO",
        row.aicte_tfw === 1 ? "YES" : "NO",
        aggr,
        row.hsc_group
    ];

    doc.font("Arial").fontSize(9);
    let x = doc.page.margins.left + 10;
    const rowHeight = 30;
    // const paddingvalue=5;
    // let nameheight=heightOfString(row.name);
    const nameColumnIndex = 2; 
    const nameText = String(rowData[nameColumnIndex]);
    const nameColumnWidth = columns[nameColumnIndex].width - 2 * padding;
    const nameheight = doc.heightOfString(nameText, {
        width: nameColumnWidth,
        align: "center"
    });
    const dynamicrowheight=Math.max(rowHeight,nameheight+10)
    rowData.forEach((data, idx) => {
        doc.rect(x, yPosition-4.5, columns[idx].width, dynamicrowheight).stroke();
        doc.text(String(data), x + padding, yPosition+5, {
            width: columns[idx].width - 2 * padding,
            align: "center"
        });
        x += columns[idx].width;
    });

    return yPosition + dynamicrowheight;
}
let currentbranch = "";
let serial = 1;

result.forEach((row, index) => {
    const isNewBranch = currentbranch !== row.branch_name;

    const nameColumnIndex = 2;
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

        if (currentY + totalRequired+30 > doc.page.height - doc.page.margins.bottom) {
            doc.addPage();
            header("TNLEA", doc, allot_coll_code);
            currentY = doc.y;
        }

        doc.font("Arial-Bold").fontSize(12).text(
            row.branch_name.toUpperCase(),
            doc.page.margins.left + 10,
            currentY + 10
        );

        currentY = TableHeader(currentY + 40)+5;
        currentbranch = row.branch_name;
    }

    if (!isNewBranch && currentY + rowHeight+30 > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
        header("TNLEA", doc, allot_coll_code);

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
    footer(doc)
    doc.end();
    }
}

module.exports=form_tnlea;  