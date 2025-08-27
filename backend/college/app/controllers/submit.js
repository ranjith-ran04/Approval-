const db = require("../config/db");

const submit = async(req,res) => {
    try{
        const c_code = req.user.counsellingCode;
        if(!c_code) return res.status(400).json({err: "college code required"});

        const submitQ = `update college_info set freezed = 1 where c_code = ?`;
        await db.query(submitQ,[c_code]);
        res.status(200).json({msg:"Submitted successfully"});
    }catch(err){
        return res.status(500).json({ err: "Query error", sqlErr: err.message});
    }
}

const getFreezed = async(req,res) => {
    try{
        const c_code = req.user.counsellingCode;
        if(!c_code) return res.status(400).json({err: "College code is requried"});

        const getFreezedQ = `select freezed from college_info where c_code=?`;
        const [result] = await db.query(getFreezedQ,[c_code]);
        res.status(200).send(result);
    }catch(err){
        return res.stats(500).json({err:"Query error", sqlErr:e.message});
    }
}
module.exports = {submit, getFreezed};