const express = require('express');
const router = express.Router();
const { isAuthenticatedUser } = require('../middlewares/auth')
const { register, login, forgotPassword, resetPassword, logout, authenticateUser } = require('../controllers/authcontroller.js');

router.post('/register', register);
router.post('/login', login);
router.get('/auth', isAuthenticatedUser, authenticateUser)

router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);

router.get('/logout', isAuthenticatedUser, logout);

module.exports = router;