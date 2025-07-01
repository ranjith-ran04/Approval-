const express = require("express");
const router = express.Router();
const formb = require("./forms/form_b");
const home = require('../app/controllers/home');
const {changePassword,fetchCode} = require('../app/controllers/changePassword');
const login = require('./controllers/login');
const verifyjwt = require('./middleware/verifyjwt')
const logout = require('./controllers/logout')

router.post("/formb", formb);
router.get("/home",verifyjwt,home);
router.post("/login",login)
router.post("/changePassword",changePassword);
router.get('/logout',logout);
router.get('/changePassword',verifyjwt,fetchCode);


module.exports = router;
