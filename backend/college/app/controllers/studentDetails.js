const db = require("../config/db");
const branchMap = require("../json/branch");

async function collegeBranchFetch(req, res) {
  var collegeCode;
  var user;
  if (req.user.counsellingCode) {
    collegeCode = req.user.counsellingCode;
    if (!collegeCode) return res.status(401).json({ msg: "college not found" });
  } else {
    user = req.user.name;
    if (!user) {
      return res.status(401).json({ msg: "user not found" });
    }
    collegeCode = req.body.collegeCode;
  }
  const query = "select b_code from branch_info where c_code = ?";
  try {
    const [result] = await db.query(query, [collegeCode]);
    if (!result) return res.status(500).json({ msg: "error in query" });
    const branch = [];
    // // console.log(result);
    result.map((item) => {
      branch.push(`${branchMap.get(item.b_code)}-${item.b_code}`);
    });
    // console.log(branch);
    res.status(200).send(branch);
  } catch (err) {
    return res.status(500).json({ msg: "error in query" });
  }
}

async function studentDetails(req, res) {
  var collegeCode;
  var name;
  if (req.user.counsellingCode) {
    collegeCode = req.user.counsellingCode;
    if (!collegeCode) return res.status(401).json({ msg: "college not found" });
  } else {
    name = req.user.name;
    if (!name) return res.status(401).json({ msg: "user not found" });
    collegeCode = req.body.collegeCode;
  }
  const branch = req.body.branch;
  const supp = req.body.supp;
  const query = supp
    ? `select name,reg_no as app_no from total_allotted where category ='SU' and (allot_coll_code =? and allot_branch = ?);`
    : `select name,a_no as app_no from student_info where c_code = ? and b_code = ?`;
  // // console.log(query);
  try {
    const [result] = await db.query(query, [collegeCode, branch]);
    if (!result) return res.status(500).json({ msg: "error in query" });
    res.status(200).send(result);
  } catch (err) {
    return res.status(500).json({ msg: "error in query" });
  }
}

async function discontinuedDetails(req, res) {
  var collegeCode;
  var name;
  if (req.user.counsellingCode) {
    collegeCode = req.user.counsellingCode;
    if (!collegeCode) return res.status(401).json({ msg: "college not found" });
  } else {
    name = req.user.name;
    if (!name) return res.status(401).json({ msg: "user not found" });
    collegeCode = req.body.collegeCode;
  }
  const branch = req.body.branch;
  const supp = req.body.supp;
  const query = `select reg_no as app_no, name, approve_state, tc_state  from discontinued_info where collcode = ? and branch = ?`;
  // const query = supp?`select name,reg_no as app_no from total_allotted where category ='SU' and (allot_coll_code =? and allot_branch = ?);`:`select name,a_no as app_no from student_info where c_code = ? and b_code = ?`;
  // // console.log(query);
  try {
    const [result] = await db.query(query, [collegeCode, branch]);
    if (!result) return res.status(500).json({ msg: "error in query" });
    res.status(200).send(result);
  } catch (err) {
    return res.status(500).json({ msg: "error in query" });
  }
}

module.exports = { collegeBranchFetch, studentDetails, discontinuedDetails };