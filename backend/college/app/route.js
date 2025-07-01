const express = require("express");
const router = express.Router();
const formb = require("./forms/form_b");
const login = require("./controllers/login")

router.post("/formb", formb);
router.post("/login", login);

module.exports = router;
