const db = require('../config/db');

function branch(req,res){
    const {collegeCode} = req.query;

    if (!collegeCode){
        return res.status(400).json({"err" : "collegeCode is required" });
    }
    const query = "select * from branch_info where c_code=?";

    db.query(query,[collegeCode], (err,result) => {
        if(err){
            return res.status(500).json({ msg : "error in query"});
        }
        res.status(200).send(result);
    });

}

function editBranch(req, res){
    const {collegeCode, b_code, ...changedFields} = req.body;

    // console.log(collegeCode);
    // console.log(b_code);
    console.log("changed fields before : ",{...changedFields});

    const keys = Object.keys(changedFields);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const values = keys.map( key => changedFields[key]);
    values.push(collegeCode,b_code);

    console.log(keys);
    console.log(setClause);
    console.log(values);

    if(!collegeCode){
        return res.status(400).json({ err : "collegeCode is required"});
    }

    const query = `update branch_info set ${setClause} where c_code = ? and b_code = ?`;

    console.log(query);

    db.query(query,values,(err, result) => {
        if (err) {
            return res.status(500).json({ err : "error in query"});
        } res.status(200).json({ msg : "Branch updated successfully!!!"});
    })
}

module.exports = {branch, editBranch}