const express = require('express');
const session = require('express-session');
const logger = require('morgan');
const cors = require('cors');
const createError = require('http-errors');
const path = require('path');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
var env = require('dotenv').config();
const port = 8080;

const app = express();

/** load middlewares */
app.use(logger('dev'));
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(cors());

// For Passport
 
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
 
app.use(passport.initialize());
 
app.use(passport.session()); // persistent login sessions

//load passport strategies
require('./app/config/passport/passport.js')(passport, models.user);

/** routers */
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
// use routers
app.use('/auth', authRouter);
app.use('/users', userRouter);

/** error handling */
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/** App listening on port */
app.listen(port, () => {
  console.log(`MyBank app listening at http://localhost:${port}`);
});

/** Handle login display and form submit */
// app.get('/login', (req, res) => {
//   if (req.session.isLoggedIn === true) {
//     return res.redirect('/');
//   }
//   res.render('login', {error: false});
// });

// http://localhost:3000/auth
// app.post('/auth', function(req, res) {
// 	// Capture the input fields
// 	let username = req.body.username;
// 	let password = req.body.password;
// 	// Ensure the input fields exists and are not empty
// 	if (username && password) {
// 		// Execute SQL query that'll select the account from the database based on the specified username and password
// 		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
// 			// If there is an issue with the query, output the error
// 			if (error) throw error;
// 			// If the account exists
// 			if (results.length > 0) {
// 				// Authenticate the user
// 				req.session.loggedin = true;
// 				req.session.username = username;
// 				// Redirect to home page
// 				res.redirect('/home');
// 			} else {
// 				res.send('Incorrect Username and/or Password!');
// 			}			
// 			res.end();
// 		});
// 	} else {
// 		res.send('Please enter Username and Password!');
// 		res.end();
// 	}
// });

// http://localhost:3000/home
// app.get('/home', function(request, response) {
// 	// If the user is loggedin
// 	if (request.session.loggedin) {
// 		// Output username
// 		response.send('Welcome back, ' + request.session.username + '!');
// 	} else {
// 		// Not logged in
// 		response.send('Please login to view this page!');
// 	}
// 	response.end();
// });

/** Handle logout function */
// app.get('/logout', (req, res) => {
//   req.session.isLoggedIn = false;
//   res.redirect('/');
// });


// app.get('/balance', (req, res) => {
//   if (req.session.isLoggedIn === true) {
//     res.send('Your account balance is $1234.52');
//   } else {
//     res.redirect('/login?redirect_url=/balance');
//   }
// });

// app.get('/account', (req, res) => {
//   if (req.session.isLoggedIn === true) {
//     res.send('Your account number is ACL9D42294');
//   } else {
//     res.redirect('/login?redirect_url=/account');
//   }
// });

// app.get('/contact', (req, res) => {
//   res.send('Our address : 321 Main Street, Beverly Hills.');
// });