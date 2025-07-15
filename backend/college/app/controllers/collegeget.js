const db = require('../config/db');
const fieldToColumnMap=require('../json/collegemap')

const columntofieldmap={};

for(const [field,column] of Object.entries(fieldToColumnMap)){
    columntofieldmap[column]=field;
}
function collegeget(req,res){
    const collegecode=req.user.counsellingCode;
    console.log(collegecode);
    const query=`select * from college_info where c_code=${collegecode};`
    // const collegename=collegenames.get(collegecode);
    db.query(query,[collegecode],(error,result)=>{
        if(error){
            console.log(error);
            return res.status(500).json({message:"query error",error})
        }
        const data=result[0];
        const sendingdata={};
        for(const [column,value] of Object.entries(data)){
            const field =columntofieldmap[column];
            if (field) {
                if (["minority_status", "autonomous_status", "transport_facility", "b_accomodation", "g_accomodation"].includes(column)) {
                    sendingdata[field] = value === 1 ? "Yes" : "No";
                } else {
                    sendingdata[field]=value;
                }
            }
        }
        console.log(sendingdata)
        return res.status(200).json({data:sendingdata})
    })
}
module.exports=collegeget;