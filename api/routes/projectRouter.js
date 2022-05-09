const express = require('express');
const router = express.Router();
const { index, show, create, update } = require('../controllers/projectsController.js');

router.get('/', index)
router.get('/:id', show)
router.post('/', create)
router.patch('/:id', update)

module.exports = router;