const ErrorHandler = require('../utils/errorHandler');

module.exports = function(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';
  console.log("error middleware: "+err.message);

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      error: {statusCode: err.statusCode, message: err.message},
      // stack: err.stack
    })
  } 
  
  if (process.env.NODE_ENV === 'production') {
    let error = {...err};
    error.message = err.message;

    // wrong object ID error
    if (err.name === 'CastError') {
      const message = `Resource not found. Invalid ${err.path}`;
      error = new ErrorHandler(message, 404);
    }

    // handled validation error
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(value=> value.message);
      error = new ErrorHandler(message, 400);
    }

    if (err.name === 'JsonWebTokenError') {
      const message = 'JSON WebToken is invalid. Try Again';
      error = new ErrorHandler(message, 500)
    }
    
    if (err.name === 'TokenExpiredError') {
      const message = 'JSON Web Token is expired. Try Again';
      error = new ErrorHandler(message, 500)
    }

    res.status(error.statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });

  }
}