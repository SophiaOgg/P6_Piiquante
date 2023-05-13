const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const passwordValidator = require("../middleware/password");
const limiter = require('../middleware/rateLimit')

router.post('/signup',passwordValidator, userCtrl.signup);
router.post('/login',limiter.loginLimiter, userCtrl.login);

module.exports = router;