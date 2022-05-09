const express = require('express');
const router = express.Router();
const projectRouter = require('../routes/projectRouter');

const { index, show, create, update, disable, createUserGroup, userGroups } = require('../controllers/usersController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.use(isAuthenticatedUser);

// /* users#index */
router.get('/', index);

// /* users#show */
router.get('/:id', show);

// /* users#show */
router.get('/:id/groups', userGroups);

// to project actions
router.use('/:id/projects', projectRouter);

// /* users#create */
router.post('/', create);

// /* users#update */
router.patch('/:id', update);

// /* users#disable */
router.get('/:id/disable', disable);

// /* users#createGroup */
router.post('/:id/groups', createUserGroup);


module.exports = router;
