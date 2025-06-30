const express = require("express");
const router = express.Router();
const forma = require("./forms/form_a");
const formb = require("./forms/form_b");

router.post("/forma", forma);
router.post("/formb", formb);

module.exports = router;
