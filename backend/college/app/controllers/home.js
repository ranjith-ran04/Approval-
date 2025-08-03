const db = require('../config/db')


async function home(req,res){
    const collegeCode = parseInt(req.user.counsellingCode,10);
    const query = "select c_code as collegeCode,name_of_college as collegeName,name_of_principal as principalName,taluk,district,pin_code as pincode,constituency,chairman,phone as collegeContact from college_info where c_code = ?;"
    try{
    const [result] = await db.query(query,[collegeCode]);
    res.status(200).send(result[0]);
    }catch(err){
            return res.status(500).json({msg:'error in query'});

    }
}

module.exports = home;