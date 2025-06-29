const express = require("express");
const router = express.Router();
const formb = require("./forms/form_b");
const form_tnlea = require("./forms/form_tnlea");

router.post("/formb", formb);
// router.post("/form_tnlea",form_tnlea);
router.post("/form_tnlea",form_tnlea);

module.exports = router;
