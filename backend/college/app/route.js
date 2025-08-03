const express = require("express");
const router = express.Router();
const forma = require("./forms/form_a");
const formb = require("./forms/form_b");
<<<<<<< HEAD
const formfg = require("./forms/form_fg");
const formd = require("./forms/form_d");
const home = require('../app/controllers/home');
const {changePassword,fetchCode} = require('../app/controllers/changePassword');
const login = require('./controllers/login');
const verifyjwt = require('./middleware/verifyjwt')
const logout = require('./controllers/logout')

router.get("/formb",verifyjwt,formb);
router.get("/formfg",verifyjwt,formfg);
router.get("/formd",verifyjwt,formd);
router.get("/home",verifyjwt,home);
router.post("/login",login)
router.post("/changePassword",changePassword);
router.get('/logout',logout);
router.get('/changePassword',verifyjwt,fetchCode);
router.get('/login',logout);

=======
const formc = require("./forms/form_c");
const form_tnlea = require("./forms/form_tnlea");
const home = require('../app/controllers/home');
const {changePassword,fetchCode} = require('../app/controllers/changePassword');
const {login,fetchlogin} = require('./controllers/login');
const verifyjwt = require('./middleware/verifyjwt')
const logout = require('./controllers/logout')
const collegeinfo = require("./controllers/collegeinfo");
const {branch, editBranch, deleteBranch, addBranch} = require("./controllers/branch");
const {collegeBranchFetch,studentDetails} = require('./controllers/studentDetails');
const { student, editStudent, deleteStudent } = require("./controllers/studentInfo");

// console.log(typeof collegeBranchFetch);

router.get("/forma", verifyjwt,forma);
router.get("/formb",verifyjwt,formb);
router.get("/formc", verifyjwt,formc);
router.get("/formlea",verifyjwt,form_tnlea);
router.get("/home",verifyjwt,home);
router.post("/changePassword",changePassword);
router.get('/changePassword',verifyjwt,fetchCode);
router.post("/login",login)
router.get('/logout',logout);
router.get('/login',verifyjwt,fetchlogin);
router.get("/branch", verifyjwt,branch);
router.put("/branch", verifyjwt,editBranch);
router.delete("/branch", verifyjwt,deleteBranch);
router.post("/branch", verifyjwt,addBranch);
router.post("/collegeinfo",collegeinfo);
router.get('/collegeBranchFetch',verifyjwt,collegeBranchFetch);
router.post('/collegeBranchFetch',verifyjwt,collegeBranchFetch);
router.post('/studentBranch',verifyjwt,studentDetails);
router.get("/student", student);
router.put("/student", editStudent);
router.delete("/student", deleteStudent);
>>>>>>> 51d74f161c2401dbe4c9f719c371648fd551158b

module.exports = router;
