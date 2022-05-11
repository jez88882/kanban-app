const express = require('express');
const router = express.Router();
const { checkAdmin } = require('../middlewares/auth')
const { index, create } = require('../controllers/userGroupsController');

router.get('/',  index)
router.post('/', checkAdmin, create)

module.exports = router;