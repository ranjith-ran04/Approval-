const express = require("express");
const router = express.Router();
const formb = require("./forms/form_b");
const home = require('../app/controllers/home')

// router.get("/forma", forma);
router.post("/formb", formb);
router.post("/home",home);

module.exports = router;
