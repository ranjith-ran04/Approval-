const db = require("../config/db");
// const util = require("util");
// const query = util.promisify(db.query).bind(db);

async function branch(req, res) {
  try {
    const collegeCode = req.user.counsellingCode;
    
    if (!collegeCode) {
      return res.status(400).json({ err: "collegeCode is required" });
    }
    const selectQuery = "select * from branch_info where c_code=?";
    const [result] = await db.query(selectQuery, [collegeCode]);
    
    res.status(200).send(result);
  } catch (err) {
    res.status(500).json({ err: "Query error", sqlErr: err });
  }
}

async function editBranch(req, res) {
  try {
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
    const editQuery = `update branch_info set ${setClause} where c_code = ? and b_code = ?`;
    await db.query(editQuery, values);
    res.status(200).json({ msg: "Branch updated successfully!!!" });
  } catch (err) {
    return res.status(500).json({ err: "Query error", sqlErr: err });
  }
}

async function deleteBranch(req, res) {
  try {
    const collegeCode = req.user.counsellingCode;
    const { b_code } = req.body;
    console.log(collegeCode,b_code);
    
    if (!collegeCode || !b_code) {
      return res
        .status(400)
        .json({ err: "collegeCode and branch code is required" });
    }
    const deleteQuery = `delete from branch_info where c_code = ? and b_code = ?`;
    await db.query(deleteQuery, [collegeCode, b_code]);
    res
      .status(200)
      .json({ success: true, msg: "Branch deleted successfully!!!" });
  } catch (err) {
    return res.status(500).json({ err: "Query error", sqlErr: err });
  }
}

async function addBranch(req, res) {
  try {
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
    const checkQuery = `select * from branch_info where c_code = ? and b_code = ?`;

    const existing = await db.query(checkQuery, [collegeCode, b_code]);
    if (existing.length > 0) {
      return res
        .status(409)
        .json({ err: "Branch already exists for this college." });
    }
    const addQuery = `insert into branch_info(c_code, b_code,branch_name,approved_in_take,first_year_admitted,discontinued,transfered_from,transfered_to,year_of_start,accredition_valid_upto,NBA_2020,LAP,Amount) values(?,?,?,?,?,?,?,?,?,?,?,?,?);`;
    await db.query(addQuery, values);
    res.status(201).json({ msg: "Branch Added Successfully!!!" });
  } catch (err) {
    return res.status(500).json({ err: "Query error", sqlErr: err });
  }
}

module.exports = { branch, editBranch, deleteBranch, addBranch };
