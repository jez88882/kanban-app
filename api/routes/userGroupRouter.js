const express = require('express');
const router = express.Router();
const { checkAdmin } = require('../middlewares/auth')
const { index, create, checkGeneralPM } = require('../controllers/userGroupsController');

router.get('/',  index)
router.post('/', checkAdmin, create)
router.get('/checkGeneralPM', checkGeneralPM)

module.exports = router;