const express = require("express");
const router = express.Router();
const forma = require("./forms/form_a");
const formb = require("./forms/form_b");
const formc = require("./forms/form_c");
const home = require('../app/controllers/home');
const {branch, editBranch, deleteBranch, addBranch} = require("./controllers/branch");

router.post("/forma", forma);
router.post("/formb", formb);
router.post("/formc", formc);
router.post("/home",home);
router.get("/branch", branch);
router.put("/branch", editBranch);
router.delete("/branch", deleteBranch);
router.post("/branch", addBranch);

module.exports = router;
