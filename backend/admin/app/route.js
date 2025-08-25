const express = require("express");
const router = express.Router();
const {login,fetchlogin} = require('./controllers/login');
const verifyjwt = require('../../college/app/middleware/verifyjwt');
const home = require('./controllers/home');
const collegeget = require("../../college/app/controllers/collegeget");
const collegeinfo = require("../../college/app/controllers/collegeinfo");
const principal_approved = require("./forms/principal_approved");
const principal_notapproved = require("./forms/principal_notapproved");

router.post('/admin/login',login);
router.get('/admin/login',verifyjwt,fetchlogin);
router.get('/admin/home',verifyjwt,home);
router.post('/admin/collegeadmin',verifyjwt,collegeget);
router.put('/admin/collegeadmin',verifyjwt,collegeinfo);
router.get('/admin/principal-approved',principal_approved);
router.get('/admin/principal-notapproved',principal_notapproved);

module.exports = router;
