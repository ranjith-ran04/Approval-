const db = require("../config/db");

const submit = async(req,res) => {
    try{
        const c_code = req.user.counsellingCode;
        if(!c_code) return res.status(400).json({err: "college code required"});

        submitQ = `update college_info set freezed = 1 where c_code = ?`;
        await db.query(submitQ,[c_code]);
        res.status(200).json({msg:"Submitted successfully"});
    }catch(err){
        return res.status(500).json({ err: "Query error", sqlErr: err.message});
    }
}

module.exports = {submit};