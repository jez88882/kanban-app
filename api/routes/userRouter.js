const express = require('express');
const router = express.Router();

const { index, show, create, update, disable, createUserGroup } = require('../controllers/usersController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.use(isAuthenticatedUser);

// /* users#index */
router.get('/', index);

// /* users#show */
router.get('/:id', show);

// /* users#create */
// checkAdmin
router.post('/', create);

// /* users#update */
// checkAdmin
router.put('/:id', update);

// /* users#disable */
// checkAdmin
router.get('/:id/disable', disable);

// /* users#createGroup */
router.post('/:id/groups', createUserGroup);


module.exports = router;
