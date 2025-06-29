const express = require("express");
const router = express.Router();
const formb = require("./forms/form_b");

router.get("/forma", forma);
router.post("/formb", formb);

module.exports = router;
