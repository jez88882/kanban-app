const express = require('express');
const session = require('express-session');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
// const hpp = require('hpp');
const errorsMiddleware = require('./middlewares/errors')
const ErrorHandler = require('./utils/errorHandler');
const sanitize = require('sanitize')

// handling Uncaught Exception
process.on('uncaughtException', err => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down due to uncaught exception.");
  process.exit(1);
});

const app = express();

// set up config.env file variables
dotenv.config({path : './config/.env'});

/** load middlewares */
app.use(express.json()) // for parsing application/json
// app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
if (process.env.NODE_ENV !== 'production') {
  app.use(logger('dev'));
}
app.use(cookieParser());
// app.use(cors({
//   origin:'http://localhost:3000',
//   credentials: true
// }));
app.use(session({
  secret: 'ads',
  resave: false,
  saveUninitialized: false,
  cookie: {secure: true}
}));

// prevent parameter pollution
// app.use(hpp());
app.use(sanitize.middleware);


/** routers */
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const applicationRouter = require('./routes/applicationRouter');
const userGroupRouter = require('./routes/userGroupRouter')
const taskRouter = require('./routes/taskRouter')
const apiRouter = require('./routes/apiRouter')
const {isAuthenticatedUser} = require('./middlewares/auth')

// use routers
// app.use('/api/v1', apiRouter)
app.use('/api/v1', authRouter)
app.use(isAuthenticatedUser) // authenticate first
app.use('/api/v1/users', userRouter)
app.use('/api/v1/applications', applicationRouter)
app.use('/api/v1/groups', userGroupRouter)
app.use('/api/v1/tasks', taskRouter)


// handling unhandled routes
app.all('*', (req, res, next) => {
  next(new ErrorHandler(`Error: 402`), 404);
});

/** error handling */
app.use(errorsMiddleware);

/** App listening on port */
const server = app.listen(process.env.PORT, () => {
  console.log(`server listening at http://localhost:${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});

// handling Unhandled Promise Rejection
process.on('unhandledRejection', err => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server due to unhandled promise rejection.");
  server.close(() => {
    process.exit(1);
  });
});
