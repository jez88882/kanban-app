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
  
  let token

  if((req.headers.authorization && req.headers.authorization.startsWith('Bearer'))) {
    token = req.headers.authorization.split(' ')[1]
  } else {
    token = req.cookies.token
  }

  if (token==="none" || !token) {
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

exports.authAPIuser = catchAsyncErrors(async function(req, res, next) {
    console.log('auth API');
    console.log('--------------------------------------\br')
    const username = req.paramString('username')
    const password = req.paramString('password')
    // check if email or password is entered by user
    if (!username || !password) {
      return next(new ErrorHandler('Error: 101'), 400); //Missing details
    }

    console.log("getting user...")
    const user = await User.unscoped().findOne({ where: { username }});
  
    if (!user) {
      return next(new ErrorHandler('Error: 102', 401));
    }

    console.log("checking password...")
    // check if password is correct
    const passwordMatches = await user.checkPassword(password);
    if (!passwordMatches) {
      return next(new ErrorHandler('Error: 105',401));
    }

    req.user = user
    next()
})

exports.isActiveUser = catchAsyncErrors(async function(req, res, next) {
  if (req.user.dataValues.is_disabled) {
    return next(new ErrorHandler('Error: 104'))
  }
  next()
})