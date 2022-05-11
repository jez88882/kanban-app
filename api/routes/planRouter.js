const express = require('express');
const router = express.Router();
const { index, show, create } = require('../controllers/plansController');

router.get('/', index)
router.get('/:id', show)
router.post('/', create)

module.exports = router;