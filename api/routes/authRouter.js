const express = require('express');
const router = express.Router();

var authController = require('../controllers/authcontroller.js');

router.post('/register', authController.registerUser)

module.exports = router;