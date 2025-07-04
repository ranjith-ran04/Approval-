const express = require("express");
const router = express.Router();
const formb = require("./forms/form_b");
const home = require('../app/controllers/home');
const form_tnlea = require("./forms/form_tnlea");
const collegeinfo = require("./controllers/collegeinfo");
// router.get("/forma", forma);
router.post("/formb", formb);
router.post("/formlea",form_tnlea)
router.post("/home",home);
router.post("/collegeinfo",collegeinfo)

module.exports = router;
