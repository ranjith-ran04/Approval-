const express = require("express");
const router = express.Router();
const formb = require("./forms/form_b");
const formfg = require("./forms/form_fg");
const formd = require("./forms/form_d");
const home = require('../app/controllers/home');
const {changePassword,fetchCode} = require('../app/controllers/changePassword');
const login = require('./controllers/login');
const verifyjwt = require('./middleware/verifyjwt')
const logout = require('./controllers/logout')

router.get("/formb",verifyjwt,formb);
router.get("/formfg",verifyjwt,formfg);
router.get("/formd",verifyjwt,formd);
router.get("/home",verifyjwt,home);
router.post("/login",login)
router.post("/changePassword",changePassword);
router.get('/logout',logout);
router.get('/changePassword',verifyjwt,fetchCode);
router.get('/login',logout);


module.exports = router;
