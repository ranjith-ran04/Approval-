const db = require("../config/db");
const fieldToColumnMap = require("../json/collegemap");

const columntofieldmap = {};

for (const [field, column] of Object.entries(fieldToColumnMap)) {
  columntofieldmap[column] = field;
}
async function collegeget(req, res) {
  // const url = req.originalUrl;
  // const isAdminRoute = url.includes("/api/admin");
  // // console.log(url);
  // const collegecode = isAdminRoute ?  5901: req.user.counsellingCode;
  var collegecode;
  if (req.user.counsellingCode) {
    collegecode = req.user.counsellingCode;
    if (!collegecode) {
      return res.status(404).json({ message: "Collegecode not found" });
    }
  } else {
    collegecode = req.body.collegecode;
    if (!collegecode) {
      return res.status(404).json({ message: "Collegecode not found" });
    }
  }
  // console.log(collegecode);
  const query = `select * from college_info where c_code=${collegecode};`;

  // const collegename=collegenames.get(collegecode);
  try {
    const [result] = await db.query(query, [collegecode]);

    const data = result[0];
    const sendingdata = {};
    for (const [column, value] of Object.entries(data)) {
      const field = columntofieldmap[column];
      if (field) {
        if (
          [
            "minority_status",
            "autonomous_status",
            "transport_facility",
            "b_accomodation",
            "g_accomodation",
          ].includes(column)
        ) {
          sendingdata[field] = value === 1 ? "Yes" : "No";
        } else {
          sendingdata[field] = value;
        }
      }
    }
    // console.log(sendingdata)
    return res.status(200).json({ data: sendingdata });
  } catch (err) {
    // console.log(err);
    return res.status(500).json({ message: "query error", err });
  }
}
module.exports = collegeget;
