const db = require('../config/db')


function home(req,res){
    const collegeCode = parseInt(req.user.counsellingCode,10);
    const query = "select c_code as collegeCode,name_of_college as collegeName,name_of_principal as principalName,taluk,district,pin_code as pincode,constituency,chairman,phone as collegeContact from college_info where c_code = ?;"
    db.query(query,[collegeCode],(err,results)=>{
        if(err){
            return res.status(500).json({msg:'error in query'});
        }
        res.status(200).send(results[0]);
    })
}

module.exports = home;