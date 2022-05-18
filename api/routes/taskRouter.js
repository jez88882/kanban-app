const express = require('express');
const router = express.Router();
const { index, show, create } = require('../controllers/tasksController');

router.get('/', index)
router.get('/:Task_id', show)
router.post('/', create)

module.exports = router;