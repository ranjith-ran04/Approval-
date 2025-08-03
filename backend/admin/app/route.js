const express = require("express");
const router = express.Router();
const {login,fetchlogin} = require('./controllers/login');
const verifyjwt = require('../../college/app/middleware/verifyjwt');
const home = require('./controllers/home');

router.post('/admin/login',login);
router.get('/admin/login',verifyjwt,fetchlogin);
router.get('/admin/home',verifyjwt,home);

module.exports = router;
