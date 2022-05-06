const crypto = require('crypto');

const { User } = require('../models/db');
const catchAsyncErrors =require('../middlewares/catchAsyncErrors');

const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');

// register a new user
exports.register = catchAsyncErrors(async function(req, res, next) {
  const { username, email, password } = req.body;  
  const newUser = await User.create({ username, email, password });

  sendToken(user, 200, res);
});

exports.login = catchAsyncErrors(async function(req, res, next) {
  console.log('logging in...');
  console.log('parsing cookies');
  console.log(req.cookies)
  console.log(req.signedCookies)

  const { username, password } = req.body;
  console.log({username, password})

  // check if email or password is entered by user
  if (!username || !password) {
    return next(new ErrorHandler('Please enter username and password'), 400);
  }
  console.log("getting user...")
  // get user
  console.log(User)
  const user = await User.unscoped().findOne({ where: { username }});

  if (!user) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }
  console.log("checking password...")
  // check if password is correct
  const passwordMatches = await user.checkPassword(password);
  if (!passwordMatches) {
    return next(new ErrorHandler('Invalid email or password',401));
  }
  console.log('sending token...')

  sendToken(user, 200, res);
});

// forgot password
exports.forgotPassword = catchAsyncErrors( async function(req, res, next) {
  const user = await User.unscoped().findOne({ where: { email: req.body.email }});
  
// check if user exists
  if (!user) {
    return next(new ErrorHandler('No user found with this email', 404));
  }
  
  // get reset token
  const resetToken = user.getResetPasswordToken();
  
  await user.save();
  
  // create reset password url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
  
  const message = `Your password reset link: \n\n${resetUrl}\n\n if you have not requested this, i am sorry`
  
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password recovery',
      text: message
    })
  
    res.status(200).json({
      success: true,
      message: `email sent successfully to ${user.email}`
    });
    
  } catch (error) {
      user.resetPasswordToken = '';
      user.resetPasswordExpire = Date.now();
      await user.save();

      return next(new ErrorHandler('email is not sent', 500));
  }
})

// reset password => api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors( async function(req, res, next) {
    // hash url token (to compare with the hashed token in the database)
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.unscoped().findOne({where: {
      resetPasswordToken,
      resetPasswordExpire: { [Op.gt] : Date.now() } // password expiry time should be greater than today
    }});

    if (!user) {
      return next(new ErrorHandler('Password Reset Token is invalid or has expired', 400));
    }

    //setup new password
    user.password = req.body.password;
    user.resetPasswordToken = '';
    user.resetPasswordExpire = Date.now();
    await user.save();

    sendToken(user, 200, res);
});

// logout user
exports.logout = catchAsyncErrors( async function(req, res, next){
  res.cookie('token', 'none', {
    expire: new Date(Date.now()),
    httpOnly: true
  });
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
})

// authenticate user (for refresh)
exports.authenticateUser = catchAsyncErrors( async function(req, res, next){
  res.status(200).json({
    success: true,
    user: req.user
  });
})

// check group
exports.checkGroup = catchAsyncErrors(async function(req, res, next) {
  console.log('checking group')
  const user = await User.findByPk(req.params.id)
  const group = req.query.group
  const data = await user.getUserGroups();
  let result = false
  data.forEach(usergroup=>{
    if (usergroup.dataValues.name===group) {
        result = true
    }
  })
  res.json({
      success: true,
      data: result
  })
})

