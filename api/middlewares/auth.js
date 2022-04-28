const jwt = require('jsonwebtoken');
const { User } = require('../models/db');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

// check if user is authenticated
exports.isAuthenticatedUser = catchAsyncErrors( async function(req, res, next) {
  console.log('authenticating...')
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

  req.user = await User.findOne({ where: { id: decoded.id } });

  console.log(`user authenticated, id: ${req.user.id}, username: ${req.user.username}`)
  next();
})

// check if user is admin
exports.checkAdmin = function(req, res, next) {
  console.log("checking if admin...")
    if (!req.user.is_admin) {
      return next(new ErrorHandler(`Need to be admin to access this resource`, 403));
    }
    next();
}