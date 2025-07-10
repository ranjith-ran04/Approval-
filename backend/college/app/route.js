const express = require("express");
const router = express.Router();
const forma = require("./forms/form_a");
const formb = require("./forms/form_b");
const formc = require("./forms/form_c");
const form_tnlea = require("./forms/form_tnlea");
const home = require('../app/controllers/home');
const {changePassword,fetchCode} = require('../app/controllers/changePassword');
const login = require('./controllers/login');
const verifyjwt = require('./middleware/verifyjwt')
const logout = require('./controllers/logout')
const collegeinfo = require("./controllers/collegeinfo");
const {branch, editBranch, deleteBranch, addBranch} = require("./controllers/branch");

router.get("/forma", verifyjwt,forma);
router.get("/formb",verifyjwt,formb);
router.get("/formc", verifyjwt,formc);
router.get("/home",verifyjwt,home);
router.post("/changePassword",changePassword);
router.get('/changePassword',verifyjwt,fetchCode);
router.post("/login",login)
router.get('/logout',logout);
router.get('/login',logout);
router.get("/branch", verifyjwt,branch);
router.put("/branch", verifyjwt,editBranch);
router.delete("/branch", verifyjwt,deleteBranch);
router.post("/branch", verifyjwt,addBranch);
router.post("/formlea",verifyjwt,form_tnlea)
router.post("/collegeinfo",collegeinfo)




module.exports = router;
