const pdf = require("pdfkit");
const db = require("../config/db");

function form_tnlea(req,res){
    const {allot_coll_code}=req.body;
    console.log("received body:",req.body);
    // console.log(collegeCode);
    const query="select * from total_allotted where allot_coll_code=?"
    // const {collegeCode}=req.body;
    // console/log(collegeCode);
    db.query(query,[allot_coll_code],(error,result)=>{
        if(error){
           return res.status(500).json({msg:"query error"});
        }
        if(result.length==0){
            return res.status(500).json({msg:"Data not found in your table"});
        }
        else{
            const data=result[0];
            res.json(data);
            res.setHeader('Content-Type', 'form_tnlea/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${allot_coll_code}.pdf"`);
            // res.send(data);
            const doc=new pdf();
            doc.pipe(res)
            doc.fontSize(14).text("hii");
            doc.end();
        }
    })
}
module.exports=form_tnlea;  