const express = require("express");
const router = express.Router();
const {login,fetchlogin} = require('./controllers/login');
const verifyjwt = require('../../college/app/middleware/verifyjwt');
const {home, editHome} = require('./controllers/home');
const chart = require('./controllers/chart');

router.post('/login',login);
router.get('/login',verifyjwt,fetchlogin);
router.post('/home',verifyjwt,home);
router.put('/home', verifyjwt, editHome);
router.post('/chart',verifyjwt,chart);

module.exports = router;
