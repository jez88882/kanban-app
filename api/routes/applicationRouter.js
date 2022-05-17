const express = require('express');
const router = express.Router();
const { index, show, create, update } = require('../controllers/applicationsController.js');
const { checkPM } = require('../middlewares/auth')

router.get('/', index)
router.get('/:app_Acronym', show)

router.post('/', checkPM, create)
router.patch('/:app_Acronym', checkPM, update)

module.exports = router;