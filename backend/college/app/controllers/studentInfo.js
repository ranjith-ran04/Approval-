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

async function editStudent(req, res) {
  try {
    const collegeCode = req.user.counsellingCode;
    const a_no = req.body.appln_no;
    let { changedFields } = req.body;

    if (!collegeCode || !a_no) {
      return res
        .status(400)
        .json({ err: "collegeCode and application number is required" });
    }

    // Ensure dependent fields are handled when fg = 0
    if (changedFields.fg === 0 || changedFields.fg === "0") {
      changedFields = {
        ...changedFields,
        fg_district: null,
        fg_no: null,
        Amount: 0,
      };
    }

    if (changedFields.nativity === "TN") {
      changedFields.state = "TAMILNADU";
      // Always reset district properly
      changedFields.district = req.body.changedFields.district;
    } else if (changedFields.nativity === "OTHERS") {
      // Always take state from frontend or fallback empty
      changedFields.state = req.body.changedFields.state;
      // Force clear district
      changedFields.district = null;
    }

    const validColumns = ["nativity", "state", "district", "fg", "fg_district", "fg_no", "Amount"];
    const keys = Object.keys(changedFields);
    if (keys.length === 0) {
      return res.status(400).json({ err: "No fields to update" });
    }

    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const values = keys.map((key) => changedFields[key]);
    values.push(a_no);

    const editQuery = `UPDATE student_info SET ${setClause} WHERE a_no = ?`;
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

module.exports = { student, editStudent, deleteStudent };
