const express = require('express');
const router = express.Router();
const { index, show, create, update, close } = require('../controllers/plansController');

router.get('/', index)
router.get('/:MVP_name', show)
router.get('/:MVP_name/close', close)
router.patch('/:MVP_name', update)
router.post('/', create)

module.exports = router;