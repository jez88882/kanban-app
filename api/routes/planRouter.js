const express = require('express');
const router = express.Router();
const { index, show, create, update, close } = require('../controllers/plansController');
const { checkPM } = require('../middlewares/auth')

router.get('/', index)
router.get('/:MVP_name', show)
router.get('/:MVP_name/close', checkPM, close)
router.patch('/:MVP_name', checkPM, update)
router.post('/', checkPM, create)

module.exports = router;