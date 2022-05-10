const express = require('express');
const router = express.Router();
const { index, show, create, update } = require('../controllers/applicationsController.js');


router.get('/:id', show)

module.exports = router;