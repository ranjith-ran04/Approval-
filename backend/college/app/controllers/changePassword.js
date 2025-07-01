const db = require("../config/db");

function changePassword(req,res){
    const {oldPassword,newPassword,collegeCode} = req.body;
    const query = "update user_login set pass = ? where c_code = ? and pass = ?;";
    db.query(query,[newPassword,collegeCode,oldPassword],(err,results)=>{
        if(err){
            return res.status(500).json({msg:'error in query'});
        }
        if(results.affectedRows === 0){
            return res.status(404).json({msg:'user not found'});
        }
        res.status(200).json({msg:'successfully updated'});
    })
}

module.exports = changePassword;