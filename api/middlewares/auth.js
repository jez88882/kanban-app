const jwt = require('jsonwebtoken');
const { User } = require('../models/db');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

// check if user is authenticated
exports.isAuthenticatedUser = catchAsyncErrors( async function(req, res, next) {
  console.log('authenticating...')
  console.log('--------------------------------------\br')
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // remove "Bearer" from the token
  } else {
    token = req.cookies.token
  }
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