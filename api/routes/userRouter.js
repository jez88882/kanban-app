const express = require('express');
const router = express.Router();

const { index, show, create, update, disable } = require('../controllers/usersController');
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

module.exports = router;
