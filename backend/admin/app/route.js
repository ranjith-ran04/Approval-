const express = require("express");
const router = express.Router();
const {login,fetchlogin} = require('./controllers/login');
const verifyjwt = require('../../college/app/middleware/verifyjwt');
const {home, editHome} = require('./controllers/home');
const chart = require('./controllers/chart');
const fg_form = require('./forms/fg_form');
const collegeDetails = require('./forms/collegeDetails')
const collegeget = require("../../college/app/controllers/collegeget");
const collegeinfo = require("../../college/app/controllers/collegeinfo");
const principal_approved = require("./forms/principal_approved");
const principal_notapproved = require("./forms/principal_notapproved");
const princ_let = require("./forms/principal_letter");
const abs_form = require("./forms/abstract_form");

router.post('/login',login);
router.get('/login',verifyjwt,fetchlogin);
router.post('/home',verifyjwt,home);
router.put('/home',verifyjwt,editHome);
router.post('/chart',verifyjwt,chart);
router.post('/fg_form',verifyjwt,fg_form);
router.post('/collegeDetails',verifyjwt,collegeDetails);
router.post('/collegeadmin',verifyjwt,collegeget);
router.put('/collegeadmin',verifyjwt,collegeinfo);
router.post('/principal-approved',principal_approved);
router.post('/principal-notapproved',principal_notapproved);
router.post('/principal_letter',verifyjwt, princ_let);
router.post('./abstract_form',verifyjwt, abs_form);


module.exports = router;
