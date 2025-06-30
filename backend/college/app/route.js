const express = require("express");
const router = express.Router();
const formb = require("./forms/form_b");
const form_tnlea = require("./forms/form_tnlea");

// router.get("/forma", forma);
router.post("/formb", formb);
router.post("/formlea",form_tnlea)

module.exports = router;
