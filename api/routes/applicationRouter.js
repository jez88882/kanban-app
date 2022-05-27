const express = require('express');
const router = express.Router();
const planRouter = require('./planRouter')
const taskRouter = require('./taskRouter')
const { index, show, create, update } = require('../controllers/applicationsController.js');
const { checkGeneralPM, checkPM } = require('../middlewares/auth')

// keep app_Acronym in request
function keepAcronym(req, res, next) {
  req.app_Acronym = req.params.app_Acronym
  next()
}

router.get('/', index)
router.get('/:app_Acronym', show)
router.use('/:app_Acronym/plans', keepAcronym, planRouter)
router.use('/:app_Acronym/tasks', keepAcronym, taskRouter)


router.post('/', checkGeneralPM, create)
router.patch('/:app_Acronym', keepAcronym, checkPM, update)



module.exports = router;