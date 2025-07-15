const db = require('../config/db');
const fieldToColumnMap = require('../json/collegemap');
const booleanFields = ["minority_status","autonomous_status",
    "transport_facility",
    "b_accomodation",
    "g_accomodation"
];
function collegeinfo(req, res) {
    const data = req.body;
    const collegecode=req.user.counsellingCode;
    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ success: false, message: "No data provided" });
    }
    
    const dbData = {};
    for (const [field, value] of Object.entries(data)) {
        const column = fieldToColumnMap[field];
        if (column) {
            dbData[column] = value;
            console.log(dbData)
        }
    }
    booleanFields.forEach(field => {
        if (dbData[field] !== undefined) {
            dbData[field] = dbData[field] === "Yes" ? 1 : 0;
        }
    });
    const setClause = Object.keys(dbData).map(col => `${col} = ?`).join(", ");
    const values = Object.values(dbData);

    const query = `UPDATE college_info SET ${setClause} WHERE c_code =${collegecode}`;
    values.push(collegecode);
    db.query(query, values, (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Database updation error", error });
        }
        res.status(200).json({success: true,message: "College info updated successfully",
            affectedrows: result.affectedRows
        });
    });
}
module.exports = collegeinfo;
