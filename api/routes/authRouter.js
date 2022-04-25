const express = require('express');
const router = express.Router();

var { register, login, forgotPassword } = require('../controllers/authcontroller.js');

router.post('/register', register)
router.post('/login', login)

router.post('/password/forgot', forgotPassword)

module.exports = router;