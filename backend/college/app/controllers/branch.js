const db = require("../config/db");

function branch(req, res) {
  const { collegeCode } = req.query;

  if (!collegeCode) {
    return res.status(400).json({ err: "collegeCode is required" });
  }
  const query = "select * from branch_info where c_code=?";

  db.query(query, [collegeCode], (err, result) => {
    if (err) {
      return res.status(500).json({ err: "Query error", sqlErr: err });
    }
    res.status(200).send(result);
  });
}

function editBranch(req, res) {
  const { collegeCode, b_code, ...changedFields } = req.body;

  const keys = Object.keys(changedFields);
  if (keys.length === 0) {
    return res.status(400).json({ err: "No fields to update" });
  }

  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const values = keys.map((key) => changedFields[key]);
  values.push(collegeCode, b_code);

  if (!collegeCode || !b_code) {
    return res
      .status(400)
      .json({ err: "collegeCode and branch code is required" });
  }

  const query = `update branch_info set ${setClause} where c_code = ? and b_code = ?`;

  console.log(query);

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ err: "Query error", sqlErr: err });
    }
    res.status(200).json({ msg: "Branch updated successfully!!!" });
  });
}

function deleteBranch(req, res) {
  const { collegeCode, b_code } = req.body;

  if (!collegeCode || !b_code) {
    return res
      .status(400)
      .json({ err: "collegeCode and branch code is required" });
  }

  const query = `delete from branch_info where c_code = ? and b_code = ?`;

  db.query(query,[collegeCode, b_code], (err,result) => {
    if(err){
        return res.status(500).json({ success : false, err : "Query errror", sqlErr : err});
    }
    console.log(result);
     res.status(200).json({ success : true ,msg : "Branch deleted successfully!!!"});
  });
}

module.exports = { branch, editBranch, deleteBranch };
