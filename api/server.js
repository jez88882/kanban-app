const express = require('express');
const session = require('express-session');
const logger = require('morgan');
const cors = require('cors');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const env = require('dotenv').config();
const errorsMiddleware = require('./middlewares/errors')
const port = 8080;

const app = express();

/** load middlewares */
app.use(logger('dev'));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(cors());
app.use(errorsMiddleware);

/** error handling */
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
 
/** routers */
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
// use routers
// app.use('/auth', authRouter);
app.use('/users', userRouter);

/** App listening on port */
app.listen(port, () => {
  console.log(`MyBank app listening at http://localhost:${port}`);
});
