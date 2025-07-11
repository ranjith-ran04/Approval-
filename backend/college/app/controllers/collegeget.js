const db = require('../config/db');
const collegenames = require('../json/college');

function collegeget(req,res){
    const collegecode=req.user.counsellingCode;
    console.log(collegecode);
    // const query=`select ${fieldToColumnMap.collegecode},${fieldToColumnMap.collegenameWithdistrict} from college_info where =${fieldToColumnMap.collegecode}=?;`
    const collegename=collegenames.get(collegecode);

    console.log(collegename)
    if(!collegename){
        return res.status(200).json({message:"college not found"});
    }
    return res.status(200).json({collegecode:collegecode,collegenameWithdistrict:collegename})
}
module.exports=collegeget;