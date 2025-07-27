const db = require("../config/db");
const util = require("util");
const query = util.promisify(db.query).bind(db);

async function student(req, res) {
  try {
    const { collegeCode } = req.body;
    if (!collegeCode) {
      return res.status(400).json({ err: "collegeCode is required" });
    }
    const stdQuery = `select * from student_info`;
    const result = await query(stdQuery,[collegeCode]);
    res.status(200).send(result).json({ msg : "Student details sent Successfully."});

  } catch (err) {
    return res.status(500).json({ err: "Query error", sqlErr: err });
  }
}

async function editStudent(req, res){
  try{
    const {collegeCode, b_code, a_no, changedFields} = req.body;
    if(!collegeCode || !b_code || !a_no){
      return res.status(400).json({ err : "collegeCode, branch code and application number is required"});
    }
    

    res.status(200).json({ msg: "Student details updated successfully."});
  }catch(err){
    return res.status(500).json({err: "Query error", sqlErr : err});
  }
}

async function deleteStudent(req, res){
  try{
    const {collegeCode, b_code, a_no} = req.body;
    if(!collegeCode || !b_code || !a_no){
      return res.status(400).json({ err : "collegeCode, branch code and application number is required"});
    }
    const deleteQuery = `delete from student info where c_code = ? and b_code = ? and a_no = ?`;
    await query(deleteQuery,[collegeCode,b_code,a_no]);

    res.status(200).json({ msg :"Student deleted Successfully."});
  }catch(err){
    return res.status(500).json({err : "Query error", sqlErr : err});
  }
}

module.exports ={student, editStudent, deleteStudent};
