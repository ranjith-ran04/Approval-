const db = require("../config/db");
const bcrypt = require("bcrypt");

async function changePassword(req, res) {
  const { oldPassword, newPassword, collegeCode } = req.body;
  var query = "select * from user_login where c_code = ?;";
  try {
    const [results] = await db.query(query, [collegeCode]);
    const data = results[0];
    console.log(data);
    const isMatch = bcrypt.compareSync(oldPassword, data.pass);
    if (!isMatch && data.pass !== oldPassword) {
      return res.status(404).json({ msg: "user not found" });
    }
    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
    console.log(hashedNewPassword);
    query = "update user_login set pass = ?,changed = ? where c_code = ?;";
    try {
        console.log('hi');
      const [result] = await db.query(query, [hashedNewPassword, 1, collegeCode]);
      console.log(result);
      if (result.affectedRows === 0)
        return res.status(500).json({ msg: "error no affected rows" });
      res.status(200).json({ msg: "successfully updated" });
    } catch (err) {
      return res.status(500).json({ msg: "error in change update query",err:err.message });
    }
  } catch (err) {
    return res.status(500).json({ msg: "error in change select query" });
  }
}

function fetchCode(req, res) {
  try {
    const collegeCode = parseInt(req.user.counsellingCode, 10);
    res.status(200).send(collegeCode);
  } catch (error) {
    res.status(500).json({ msg: "error in fetchcollegeCode" });
  }
}

module.exports = { changePassword, fetchCode };
