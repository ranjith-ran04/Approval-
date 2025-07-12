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

  if (!collegeCode || !b_code) {
    return res
      .status(400)
      .json({ err: "collegeCode and branch code is required" });
  }

  const keys = Object.keys(changedFields);
  if (keys.length === 0) {
    return res.status(400).json({ err: "No fields to update" });
  }

  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const values = keys.map((key) => changedFields[key]);
  values.push(collegeCode, b_code);

  const query = `update branch_info set ${setClause} where c_code = ? and b_code = ?`;

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

  db.query(query, [collegeCode, b_code], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, err: "Query errror", sqlErr: err });
    }
    res
      .status(200)
      .json({ success: true, msg: "Branch deleted successfully!!!" });
  });
}

function addBranch(req, res) {
  const {
    collegeCode,
    b_code,
    branch_name,
    approved_in_take,
    first_year_admitted,
    discontinued,
    transfered_from,
    transfered_to,
    year_of_start,
    accredition_valid_upto,
    NBA_2020,
    LAP,
    Amount,
  } = req.body;

  const values = [
    collegeCode,
    b_code,
    branch_name,
    approved_in_take,
    first_year_admitted,
    discontinued,
    transfered_from,
    transfered_to,
    year_of_start,
    accredition_valid_upto,
    NBA_2020,
    LAP,
    Amount,
  ];

  const query = `insert into branch_info(c_code, b_code,branch_name,approved_in_take,first_year_admitted,discontinued,transfered_from,transfered_to,year_of_start,accredition_valid_upto,NBA_2020,LAP,Amount) values(?,?,?,?,?,?,?,?,?,?,?,?,?);`;
  const checkQuery = `select * from branch_info where c_code = ? and b_code = ?`;
  db.query(checkQuery, [collegeCode, b_code], (checkErr, rows) => {
    if (checkErr) {
      return res
        .status(500)
        .json({ err: "Error checking for duplicate", sqlErr: checkErr });
    }
    if (rows.length > 0) {
      return res
        .status(409)
        .json({ err: "Branch already exists for this college." });
    }
    db.query(query, values, (err, result) => {
      if (err) {
        return res.status(500).json({ err: "Query error", sqlErr: err });
      }
      res.status(201).json({ msg: "Branch Added Successfully!!!" });
    });
  });
}

module.exports = { branch, editBranch, deleteBranch, addBranch };
