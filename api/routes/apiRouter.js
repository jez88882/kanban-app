const express = require('express');
const router = express.Router();
const { authAPIuser, isActiveUser } = require('../middlewares/auth')
const { getTaskbyState, createTask, promote } = require('../controllers/tasksController');

router.get('/:username/:password/all-tasks:state', authAPIuser, isActiveUser, getTaskbyState)
router.post('/:username/:password/create-task', authAPIuser, isActiveUser, createTask)
router.get('/:username/:password/promote-task/:Task_id', authAPIuser, isActiveUser, promote)


module.exports = router;