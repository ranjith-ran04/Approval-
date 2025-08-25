const db = require('../config/db');
const fieldToColumnMap = require('../json/collegemap');
const booleanFields = ["minority_status","autonomous_status",
    "transport_facility",
    "b_accomodation",
    "g_accomodation"
];
async function collegeinfo(req, res) {
    // const url = req.originalUrl;
    // console.log(url);
    // var collegecode;
    // if(req.user.counsellingCode){
    //     collegecode=req.user.counsellingCode;
    //     console.log(collegecode);
    //     if(!collegecode){
    //         return res.status(404).json({message:"no collegecode"})
    //     }
    // }else{
    //     collegecode = req.body.collegecode;
    //     if(!collegecode){
    //         return res.status(404).json({message:"No collegecode"});
    //     }
    // }
const collegecode = req.user.counsellingCode?req.user.counsellingCode:req.body.collegecode;
console.log(collegecode);


if (!collegecode) {
  return res.status(404).json({ message: "No collegecode provided" });
}

    // console.log(collegecode);
    const data = req.body.changedFields;
    console.log(data);
    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ success: false, message: "No data provided" });
    } 
    console.log("hi")
    const dbData = {};
    for (const [field, value] of Object.entries(data)) {
        const column = fieldToColumnMap[field];
        if (column) {
            dbData[column] = value;
            // console.log(dbData)
        }
    }

    booleanFields.forEach(field => {
        if (dbData[field] !== undefined) {
            dbData[field] = dbData[field] === "Yes" ? 1 : 0;
        }
    });
    
    const setClause = Object.keys(dbData).map(col => `${col} = ?`).join(", ");
    const values = Object.values(dbData);
    console.log(setClause);
    const query = `UPDATE college_info SET ${setClause} WHERE c_code =${collegecode}`;
    values.push(collegecode);
    try{
        const [result] = await db.query(query, values)
        res.status(200).json({success: true,message: "College info updated successfully",
        affectedrows: result.affectedRows});
    }catch(error){
        console.error(error);
        return res.status(500).json({ success: false, message: "Database updation error", error });
    }
    };
module.exports = collegeinfo;