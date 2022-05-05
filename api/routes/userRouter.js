const express = require('express');
const router = express.Router();

const { index, show, create, update, disable, createUserGroup, checkUserGroup } = require('../controllers/usersController');
const { isAuthenticatedUser, checkAdmin } = require('../middlewares/auth');

router.use(isAuthenticatedUser);

// /* users#index */
router.get('/',index);

// /* users#show */
router.get('/:id', show);

// /* users#create */
// checkAdmin
router.post('/', checkAdmin, create);

// /* users#update */
// checkAdmin
router.put('/:id', update);

// /* users#disable */
// checkAdmin
router.get('/:id/disable', checkAdmin, disable);

// /* users#checkGroup */
router.post('/:id/groups', checkAdmin, createUserGroup);

// /* users#checkGroup */
router.get('/:id/groups', checkAdmin, checkUserGroup);

module.exports = router;
