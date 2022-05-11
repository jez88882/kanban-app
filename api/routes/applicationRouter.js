const express = require('express');
const router = express.Router();
const { index, show, create, update } = require('../controllers/applicationsController.js');


router.get('/', index)
router.get('/:id', show)

router.post('/', create)

module.exports = router;