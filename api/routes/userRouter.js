const express = require('express');
const router = express.Router();
const applicationRouter = require('./applicationRouter');

const { index, show, create, update, disable, createUserGroup, checkGroup, userApplications } = require('../controllers/usersController');
const { checkAdmin } = require('../middlewares/auth');


/* users#index */
router.get('/', index);

/* users#show */
router.get('/:username', show);

/* users#checkGroup */
router.get('/:username/groups', checkGroup);

/* to project actions*/
router.use('/:username/applications', userApplications, applicationRouter);

/* users#create */
router.post('/', checkAdmin, create);

/* users#update */
router.patch('/:username', update);

/* users#disable */
router.get('/:username/disable', checkAdmin, disable);

/* users#createGroup */
// router.post('/:username/groups', createUserGroup);

module.exports = router;
