// const db = require('../config/db');

// function collegeinfo(req, res) {
//     const data = req.body;
//     console.log(data);
//     if (!data || Object.keys(data).length === 0) {
//         return res.status(400).json({ success: false, message: "No data provided" });
//     }

//     const fields = Object.keys(data).join(',');
//     console.log(typeof fields); 
//     const placeholders = Object.keys(data).map(() => '?').join(',');
//     const values = Object.values(data);
//     // console.log(values); 
//     // const collegecode=10000;
//         const radioFields = [
//         "minority_status",
//         "autonomous_status",
//         "transport_facility",
//         "b_accomodation",
//         "g_accomodation"
//     ];

//     radioFields.forEach(field => {  
//         if (data[field] !== undefined) {
//             data[field] = data[field] === "Yes" ? 1 : 0;
//         }
//     });
    
//     const query = `INSERT INTO college_info (${fields}) VALUES (${placeholders})`;

    
//     // const query = `INSERT INTO college_info (c_code, clgname_for_use, chairman, chairman_ph_no, name_of_principal, principal_ph_no,address,  taluk, district, constituency, pin_code, phone, email, website, anti_ragging_contact_no,bank_account_no, bank_name, minority_status, autonomous_status, dist_from_district_hq, nearest_railway, dist_from_railway,transport_facility, transport, min_trans_cost, max_trans_cost,b_accomodation, b_hostel_stay_type, b_type_of_mess, b_mess_bill, b_room_rent, b_electricity_charges, b_caution_deposit, b_establishment_charges, b_addmission_fees,g_accomodation, g_hostel_stay_type, g_type_of_mess, g_mess_bill, g_room_rent, g_electricity_charges, g_caution_deposit, g_establishment_charges, g_addmission_fees) VALUES (${placeholders});`
//     db.query(query, values, (error, result) => {
//         if (error) {
//             console.error(error);
//             return res.status(500).json({ success: false, message: "Database insertion error", error });
//         } else {
//             res.status(200).json({
//                 success: true,
//                 message: "College info saved successfully",
//                 insertId: result.insertId
//             });
//         }
//     });
// }

// module.exports = collegeinfo;

const db = require('../config/db');
const fieldToColumnMap = require('../json/collegemap');
const booleanFields = ["minority_status","autonomous_status",
    "transport_facility",
    "b_accomodation",
    "g_accomodation"
];

function collegeinfo(req, res) {
    const data = req.body;
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

    const columns = Object.keys(dbData).join(", ");
    const placeholders = Object.keys(dbData).map(() => "?").join(", ");
    const values = Object.values(dbData);

    const query = `INSERT INTO college_info (${columns}) VALUES (${placeholders})`;

    db.query(query, values, (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Database insertion error", error });
        }
        res.status(200).json({success: true,message: "College info saved successfully",
            insertId: result.insertId
        });
    });
}

module.exports = collegeinfo;
