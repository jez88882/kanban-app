const express = require('express');
const router = express.Router();
const { index, show, create, update, approve, changeState, createNote, promote } = require('../controllers/tasksController');

router.get('/', index)
router.post('/', create)
router.get('/:Task_id', show)
router.patch('/:Task_id', update)
router.get('/:Task_id/approve', approve)
router.get('/:Task_id/promote', promote)
router.patch('/:Task_id/state', changeState)
router.post('/:Task_id/notes', createNote)

module.exports = router;