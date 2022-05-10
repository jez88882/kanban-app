const express = require('express');
const router = express.Router();
const applicationRouter = require('./applicationRouter');

const { index, show, create, update, disable, createUserGroup, checkGroup } = require('../controllers/usersController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.use(isAuthenticatedUser);

// /* users#index */
router.get('/', index);

// /* users#show */
router.get('/:username', show);

// /* users#checkGroup */
router.get('/:username/groups', checkGroup);

// to project actions
router.use('/:username/applications', applicationRouter);

// /* users#create */
router.post('/', create);

// /* users#update */
router.patch('/:username', update);

// /* users#disable */
router.get('/:username/disable', disable);

// /* users#createGroup */
router.post('/:username/groups', createUserGroup);

module.exports = router;
