const jwt = require('jsonwebtoken');
const { User, Application, UserGroup } = require('../models/db');
const { Op } = require('sequelize')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const checkGroup = require('../utils/checkGroup');

// check if user is authenticated
exports.isAuthenticatedUser = catchAsyncErrors( async function(req, res, next) {
  console.log('authenticating...')
  console.log('--------------------------------------\n')
  
  const token = req.cookies.token
  
  if (token==="none") {
    return next(new ErrorHandler('Login first to access this resource', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET); // gets payload

  req.user = await User.findOne({ where: { username: decoded.username } });
  
  console.log('--------------------------------------')
  console.log(`user ${req.user.username} authenticated`)
  console.log('--------------------------------------')
  next();
})

exports.checkAdmin = catchAsyncErrors( async function(req, res, next) {
  const is_admin = await checkGroup(req.user, "admin")
  if (!is_admin) {
    return next(new ErrorHandler('not authorized', 401));
  }
  
  next()
})

exports.checkPM = catchAsyncErrors( async function(req, res, next) {
 
  const app = await Application.findByPk(req.app_Acronym)
  const permittedGroup = app.App_permit_Open
  const user = req.user
  const is_permitted = await checkGroup(user, permittedGroup)
  
  if (!is_permitted) {
    return next(new ErrorHandler('not authorized', 401));
  }

  next()
})

exports.checkGeneralPM = catchAsyncErrors( async function(req, res, next) {
  console.log(req.body)

  const usergroup = await UserGroup.findOne({
    where: {
      username: req.user.username,
      group: {
        [Op.endsWith]: 'project manager'
      }
    }
  })
  
  if (!usergroup) {
    return next(new ErrorHandler('not authorized', 401));
  }
  next()
})
