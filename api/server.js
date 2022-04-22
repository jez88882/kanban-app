const express = require('express');
const session = require('express-session');
const logger = require('morgan');
const cors = require('cors');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const env = require('dotenv').config();
const errorsMiddleware = require('./middlewares/errors')
const ErrorHandler = require('./utils/errorHandler');
const PORT = process.env.PORT;

// handling Uncaught Exception
process.on('uncaughtException', err => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down due to uncaught exception.");
  process.exit(1);
});

const app = express();

/** load middlewares */
app.use(logger('dev'));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(cors());


/** routers */
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');

// use routers
// app.use('/auth', authRouter);
app.use('/users', userRouter);

// handling unhandled routes
app.all('*', (req, res, next) => {
  next(new ErrorHandler(`${req.originalUrl} route not found`), 404);
});

/** error handling */
app.use(errorsMiddleware);

/** App listening on port */
const server = app.listen(PORT, () => {
  console.log(`MyBank app listening at http://localhost:${PORT}`);
});

// handling Unhandled Promise Rejection
process.on('unhandledRejection', err => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server due to unhandled promise rejection.");
  server.close(() => {
    process.exit(1);
  });
});
