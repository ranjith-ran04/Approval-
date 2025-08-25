const express = require("express");
const router = express.Router();
const {login,fetchlogin} = require('./controllers/login');
const verifyjwt = require('../../college/app/middleware/verifyjwt');
const {home, editHome} = require('./controllers/home');
const chart = require('./controllers/chart');
const fg_form = require('./forms/fg_form');
const collegeDetails = require('./forms/collegeDetails')

router.post('/login',login);
router.get('/login',verifyjwt,fetchlogin);
router.post('/home',verifyjwt,home);
router.put('/home',verifyjwt,editHome);
router.post('/chart',verifyjwt,chart);
router.post('/fg_form',verifyjwt,fg_form);
router.post('/collegeDetails',verifyjwt,collegeDetails);

module.exports = router;
