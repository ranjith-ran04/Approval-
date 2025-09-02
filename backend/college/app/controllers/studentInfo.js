const { listStudentFiles } = require("../../../common/uploadHelper");
const db = require("../config/db");

async function checkApplnNo(req, res) {
  try {
    const collegeCode = req.user.counsellingCode;
    const appln_no = req.body.appln_no;

    if (!collegeCode) {
      return res.status(400).json({ err: "collegeCode is required" });
    }
    const stdQuery = `select count(*) as count from student_info where c_code =? and a_no = ?`;
    const result = await db.query(stdQuery, [collegeCode, appln_no]);
    // // console.log("result",result[0][0].count);
    if (result[0][0].count > 0) {
      return res
        .status(200)
        .json({ message: "Appln_no already exists", valid: false });
    }

    res.status(200).json({ message: "Valid Appln_no", valid: true });
  } catch (err) {
    return res.status(500).json({ err: "Query error", sqlErr: err.message });
  }
}

async function student(req, res) {
  try {
    const collegeCode = req.user.counsellingCode;
    const appln_no = req.body.appln_no;

    if (!collegeCode) {
      return res.status(400).json({ err: "collegeCode is required" });
    }
    const stdQuery = `select * from student_info where c_code =? and a_no = ?`;
    const studentResult = await db.query(stdQuery, [collegeCode, appln_no]);
    const student = studentResult[0] || {};

    const certQuery = `SELECT * FROM approval_certificates WHERE c_code = ? AND a_no = ?`;
    const certResult = await db.query(certQuery, [collegeCode, appln_no]);
    const certFlags = certResult[0] || {};

    const files = student.mobile
      ? listStudentFiles(student.mobile, appln_no)
      : [];

    const certificatesList = [
      { id: 1, name: "Community Certificate", key: "community" },
      {
        id: 2,
        name: "Provisional/Degree Certificate",
        key: "provisionalCertificate",
      },
      { id: 3, name: "Consolidated Mark Sheet", key: "consolidate" },
      { id: 4, name: "Transfer Certificate", key: "transferCert" },
      { id: 5, name: "First Graduate Certificate", key: "fg" },
    ].map((cert) => {
      const file = files.find((f) => f.suffix === cert.key.split("_")[0]);
      return {
        ...cert,
        uploaded: certFlags[cert.key] === 1,
        fileUrl: file?.url || null,
      };
    });
    // console.log(student);
    res.status(200).send({ student, certificates: certificatesList });
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
    // const [[checkStudent]] = await db.query(
    //   "SELECT COUNT(*) as count FROM student_info WHERE a_no = ? AND c_code = ?",
    //   [appln_no, collegeCode]
    // );

    // if (checkStudent.count === 0) {
    //   return res
    //     .status(404)
    //     .json({ err: "Application number not found in student_info" });
    // }
    const stdQuery = `select NAME,APPROVE_STATE, TC_STATE  from discontinued_info where collcode =? and reg_no = ?`;
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
    const changedFields = req.body.changedFields;

    if (!collegeCode || !a_no) {
      return res.status(400).json({
        err: "collegeCode and application number are required",
      });
    }

    if (!changedFields || Object.keys(changedFields).length === 0) {
      return res.status(400).json({ err: "No fields to update" });
    }

    const sanitizedFields = { ...changedFields };

    const keys = Object.keys(sanitizedFields);
    if (keys.length === 0) {
      return res.status(400).json({ err: "No valid fields to update" });
    }

    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const values = keys.map((key) => sanitizedFields[key]);

    values.push(a_no, collegeCode);

    const editQuery = `UPDATE student_info 
                       SET ${setClause} 
                       WHERE a_no = ? AND c_code = ?`;

    await db.query(editQuery, values);

    res.status(200).json({ msg: "Student details updated successfully." });
  } catch (err) {
    return res.status(500).json({
      err: "Query error",
      sqlErr: err.message,
    });
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

    const [checkStudent] = await db.query(
      "SELECT COUNT(*) as count FROM student_info WHERE a_no = ? AND b_code = ? AND c_code = ?",
      [a_no, branch, collegeCode]
    );

    if (checkStudent[0].count === 0) {
      return res.status(404).json({ msg: "Student not found in student_info" });
    }

    const [checkDiscontinued] = await db.query(
      "SELECT COUNT(*) as count FROM discontinued_info WHERE reg_no = ?",
      [a_no]
    );

    let query, values;

    if (checkDiscontinued[0].count === 1) {
      query = `UPDATE discontinued_info 
               SET NAME = ?, APPROVE_STATE = ?, TC_STATE = ? 
               WHERE reg_no = ? AND collcode = ? AND branch = ?`;
      values = [NAME, APPROVE_STATE, TC_STATE, a_no, collegeCode, branch];
    } else {
      query = `INSERT INTO discontinued_info 
               (reg_no, collcode, branch, name, approve_state, tc_state) 
               VALUES (?, ?, ?, ?, ?, ?)`;
      values = [a_no, collegeCode, branch, NAME, APPROVE_STATE, TC_STATE];
    }
    await db.query(query, values);
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
      return res.status(400).json({
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
      return res.status(400).json({
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

async function addStudentinfo(req, res) {
  try {
    const collegeCode = req.user.counsellingCode;
    const appln_no = req.body.appln_no;
    const b_code = req.body.b_code;
    const studentData = req.body.studentData;
    
    // console.log(collegeCode);
    // console.log(appln_no)
    // console.log(studentData);
    // console.log(b_code);
    if (!collegeCode || !appln_no || !studentData || !b_code) {
      return res
        .status(400)
        .json({
          err: "collegeCode, appln_no, and student details are required",
        });
    }

    const insertData = {
      ...studentData,
      a_no: appln_no,
      b_code: b_code,
      c_code: collegeCode,
    };

    const keys = Object.keys(insertData);
    const values = Object.values(insertData);

    const placeholders = keys.map(() => "?").join(", ");
    const insertQuery = `INSERT INTO student_info (${keys.join(
      ", "
    )}) VALUES (${placeholders})`;

    await db.query(insertQuery, values);
    res.status(200).json({ msg: "Student added successfully." });
  } catch (err) {
    return res.status(500).json({ err: "Query error", sqlErr: err.message });
  }
}

module.exports = {
  checkApplnNo,
  student,
  editStudent,
  deleteStudent,
  addStudentinfo,
  dicontinuedStudent,
  editDiscontinuedStudent,
  deleteDiscontinuedStudent,
};
