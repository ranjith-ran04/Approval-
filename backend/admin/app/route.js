const express = require("express");
const router = express.Router();
const {login,fetchlogin} = require('./controllers/login');
const verifyjwt = require('../../college/app/middleware/verifyjwt');
const home = require('./controllers/home');
const chart = require('./controllers/chart');
const fg_form = require('./forms/fg_form');

router.post('/login',login);
router.get('/login',verifyjwt,fetchlogin);
router.get('/home',verifyjwt,home);
router.post('/chart',verifyjwt,chart);
router.post('/fg_form',verifyjwt,fg_form);

module.exports = router;
