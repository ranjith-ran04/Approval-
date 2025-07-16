const db = require('../config/db');
const branchMap = require('../json/branch');

function collegeBranchFetch(req,res){
    const collegeCode = req.user.counsellingCode;
    if(!collegeCode) return res.status(401).json({msg:'college not found'});
    const query = 'select b_code from branch_info where c_code = ?';
    db.query(query,[collegeCode],(err,result)=>{
        if(err) return res.status(500).json({msg:'error in query'});
        if(!result) return res.status(500).json({msg:'error in query'});
        const branch = [];
        result.map((item)=>{
            branch.push(`${branchMap.get(item.b_code)}-${item.b_code}`)
        })
        console.log(branch);
        res.status(200).send(branch);
    });
}

function studentDetails(req,res){
    const collegeCode = req.user.counsellingCode;
    const branch = req.body.branch;
    if(!collegeCode) return res.status(401).json({msg:'college not found'});
    const query = 'select name,a_no as app_no from student_info where c_code = ? and b_code = ?';
    db.query(query,[collegeCode,branch],(err,result)=>{
         if(err) return res.status(500).json({msg:'error in query'});
        if(!result) return res.status(500).json({msg:'error in query'});
        res.status(200).send(result);
    })
}

module.exports = {collegeBranchFetch,studentDetails};