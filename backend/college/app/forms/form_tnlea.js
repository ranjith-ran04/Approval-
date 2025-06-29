const pdf = require("pdfkit");
const db = require("../config/db");

function form_tnlea(req,res){
    const {allot_coll_code}=req.body;
    console.log("received body:",req.body);
    // console.log(collegeCode);
    const query="SELECT branch_name,a_no,name,community,fg,Availed_fg,aicte_tfw,obt_1,max_1,obt_2,max_2,obt_3,max_3,obt_4,max_4,obt_5,max_5,obt_6,max_6,obt_7,max_7,obt_8,max_8,hsc_group from (select b_code,branch_name from branch_info where c_code=?) as branch_info,(select b_code,a_no,name,community,fg,Availed_fg,aicte_tfw,obt_1,max_1,obt_2,max_2,obt_3,max_3,obt_4,max_4,obt_5,max_5,obt_6,max_6,obt_7,max_7,obt_8,max_8,hsc_group from student_info where c_code=?) as student_info where student_info.b_code=branch_info.b_code order by branch_name";
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
            // res.json(data);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${allot_coll_code}.pdf"`);
            // res.send(data);
            const doc=new pdf();
            doc.pipe(res)
            doc.fontSize(14).text("hii");
            doc.text("Form TNLEA");
            doc.end();
        }
    })
}
module.exports=form_tnlea;