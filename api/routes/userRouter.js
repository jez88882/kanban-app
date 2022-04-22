const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');

/* users#index */
router.get('/', usersController.index);

router.get('/test', usersController.test);
/* users#show */
router.get('/:id', usersController.show);

/* users#create */
router.post('/', usersController.create);

/* users#update */
router.put('/:id',  usersController.update);

/* users#disable */
router.get('/:id/disable', usersController.disable);


module.exports = router;
