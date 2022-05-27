const express = require('express');
const router = express.Router();
const { checkAdmin } = require('../middlewares/auth')
const { index, create, checkCreateApp } = require('../controllers/userGroupsController');

router.get('/',  index)
router.post('/', checkAdmin, create)
router.get('/checkGeneralPM', checkCreateApp)

module.exports = router;