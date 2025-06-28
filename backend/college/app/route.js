const express = require("express");
const router = express.Router();
const {formb} = require("./forms/form_b");

router.post("/formb", formb);

module.exports = router;
