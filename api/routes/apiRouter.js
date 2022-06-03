const express = require('express');
const router = express.Router();
const { authAPIuser, isActiveUser, checkReq } = require('../middlewares/auth')
const { getTaskbyState, createTask, promote } = require('../controllers/tasksController');

router.get('/:username/:password/get-task-by-state/:state', authAPIuser, isActiveUser, getTaskbyState)
router.post('/:username/:password/create-task',authAPIuser, isActiveUser, createTask)
router.get('/:username/:password/promote-task-2-done/:Task_id', authAPIuser, isActiveUser, promote)


module.exports = router;