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

router.post('/login',login);
router.get('/login',verifyjwt,fetchlogin);
router.post('/home',verifyjwt,home);
router.put('/home',verifyjwt,editHome);
router.post('/chart',verifyjwt,chart);
router.post('/fg_form',verifyjwt,fg_form);
router.post('/collegeDetails',verifyjwt,collegeDetails);
router.post('/collegeadmin',verifyjwt,collegeget);
router.put('/collegeadmin',verifyjwt,collegeinfo);
router.get('/principal-approved',principal_approved);
router.get('/principal-notapproved',principal_notapproved);



module.exports = router;
