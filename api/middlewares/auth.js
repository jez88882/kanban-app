const jwt = require('jsonwebtoken');
const { User } = require('../models/db');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const checkGroup = require('../utils/checkGroup');

// check if user is authenticated
exports.isAuthenticatedUser = catchAsyncErrors( async function(req, res, next) {
  console.log('authenticating...')
  console.log('--------------------------------------\n')
  
  const token = req.cookies.token
  
  if (!token) {
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
  const is_PM = await checkGroup(req.user, "project manager", req.app_Acronym)
  if (!is_PM) {
    return next(new ErrorHandler('not authorized', 401));
  }
  next()
})

exports.checkProjLead = catchAsyncErrors( async function(req, res, next) {
  const is_lead = await checkGroup(req.user, "project lead", req.app_Acronym)
  if (!is_lead) {
    return next(new ErrorHandler('not authorized', 401));
  }
  next()
})