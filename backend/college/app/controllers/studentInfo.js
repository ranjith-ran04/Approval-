const db = require("../config/db");

async function student(req, res) {
  try {
    const collegeCode = req.user.counsellingCode;
    const appln_no = req.body.appln_no;

    if (!collegeCode) {
      return res.status(400).json({ err: "collegeCode is required" });
    }
    const stdQuery = `select * from student_info where c_code =? and a_no = ?`;
    const result = await db.query(stdQuery, [collegeCode, appln_no]);
    res.status(200).send(result);
  } catch (err) {
    return res.status(500).json({ err: "Query error", sqlErr: err.message });
  }
}

async function dicontinuedStudent(req, res) {
  try {
    const collegeCode = req.user.counsellingCode;
    const appln_no = req.body.appln_no;

    if (!collegeCode) {
      return res.status(400).json({ err: "collegeCode is required" });
    }
    const stdQuery = `select NAME,CAST(APPROVE_STATE AS CHAR) as APPROVE_STATE, CAST(TC_STATE AS CHAR) as TC_STATE  from discontinued_info where collcode =? and reg_no = ?`;
    const result = await db.query(stdQuery, [collegeCode, appln_no]);
    res.status(200).send(result);
  } catch (err) {
    return res.status(500).json({ err: "Query error", sqlErr: err.message });
  }
}

async function editStudent(req, res) {
  try {
    const collegeCode = req.user.counsellingCode;
    const a_no = req.body.appln_no;
    const { changedFields } = req.body;

    if (!collegeCode || !a_no) {
      return res
        .status(400)
        .json({ err: "collegeCode and application number is required" });
    }
    const keys = Object.keys(changedFields);
    if (keys.length === 0) {
      return res.status(400).json({ err: "No fields to update" });
    }
    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const values = keys.map((key) => changedFields[key]);
    values.push(a_no);
    const editQuery = `update student_info set ${setClause} where a_no=?`;
    await db.query(editQuery, values);
    res.status(200).json({ msg: "Student details updated successfully." });
  } catch (err) {
    return res.status(500).json({ err: "Query error", sqlErr: err.message });
  }
}

async function editDiscontinuedStudent(req, res) {
  try {
    const collegeCode = req.user.counsellingCode;
    const a_no = req.body.appln_no;
    const { NAME, APPROVE_STATE, TC_STATE } = req.body.studentData;
    const branch = req.body.selected;

    if (!collegeCode || !a_no) {
      return res
        .status(400)
        .json({ err: "collegeCode and application number is required" });
    }
    const [[count]] = await db.query("SELECT count(*) as count from discontinued_info where reg_no = ?", a_no);
    // console.log(count);
    
    const values = count.count == 1 ? [NAME, APPROVE_STATE, TC_STATE, a_no] : [a_no, collegeCode, branch, NAME, APPROVE_STATE, TC_STATE];
    const editQuery = count.count == 1 ?
      `update discontinued_info set NAME = ? ,APPROVE_STATE =? ,TC_STATE = ?  where reg_no=?`
      : `insert into discontinued_info(reg_no,collcode,branch,name,approve_state,tc_state) values(?,?,?,?,?,?)`;
    await db.query(editQuery, values);
    res.status(200).json({ msg: "Student details updated successfully." });
  } catch (err) {
    return res.status(500).json({ err: "Query error", sqlErr: err.message });
  }
}

async function deleteStudent(req, res) {
  try {
    const collegeCode = req.user.counsellingCode;
    const a_no = req.body.appln_no;

    if (!collegeCode || !a_no) {
      return res
        .status(400)
        .json({
          err: "collegeCode and application number is required",
        });
    }

    const deleteQuery = `delete from student_info where a_no = ?`;
    await db.query(deleteQuery, a_no);
    res.status(200).json({ msg: "Student deleted Successfully." });
  } catch (err) {
    return res.status(500).json({ err: "Query error", sqlErr: err.message });
  }
}

async function deleteDiscontinuedStudent(req, res) {
  try {
    const collegeCode = req.user.counsellingCode;
    const a_no = req.body.appln_no;

    if (!collegeCode || !a_no) {
      return res
        .status(400)
        .json({
          err: "collegeCode and application number is required",
        });
    }

    const deleteQuery = `delete from discontinued_info where reg_no = ?`;
    await db.query(deleteQuery, a_no);
    res.status(200).json({ msg: "Student deleted Successfully." });
  } catch (err) {
    return res.status(500).json({ err: "Query error", sqlErr: err.message });
  }
}

module.exports = { student, editStudent, deleteStudent, dicontinuedStudent, editDiscontinuedStudent, deleteDiscontinuedStudent };
