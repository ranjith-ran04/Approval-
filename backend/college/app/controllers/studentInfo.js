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
    console.log("result",result[0][0].count);
    if(result[0][0].count>0){
      return res.status(200).json({message:"Appln_no already exists",valid:false});
    }
    
    res.status(200).json({message:"Valid Appln_no",valid:true});
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
    await db.query(editQuery,values);
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
async function addStudentinfo(req, res) {
  try {
    const collegeCode = req.user.counsellingCode;
    const appln_no = req.body.app_no;
    const b_code = req.body.b_code; 
    const studentData = req.body.studentData; 
    

    if (!collegeCode || !appln_no || !studentData || !b_code) {
      return res
        .status(400)
        .json({ err: "collegeCode, appln_no, and student details are required" });
    }

    const insertData = { ...studentData, a_no: appln_no,b_code: b_code, c_code: collegeCode };
    
    const keys = Object.keys(insertData);
    const values = Object.values(insertData);

    const placeholders = keys.map(() => "?").join(", ");
    const insertQuery = `INSERT INTO student_info (${keys.join(", ")}) VALUES (${placeholders})`;

    await db.query(insertQuery, values);
    res.status(200).json({ msg: "Student added successfully." });
  } catch (err) {
    return res.status(500).json({ err: "Query error", sqlErr: err.message });
  }
}

module.exports = {checkApplnNo, student, editStudent, deleteStudent,addStudentinfo };
