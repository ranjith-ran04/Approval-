const express = require("express");
const router = express.Router();
const forma = require("./forms/form_a");
const formb = require("./forms/form_b");
const home = require('../app/controllers/home')

router.post("/forma", forma);
router.post("/formb", formb);
router.post("/home",home);

module.exports = router;
