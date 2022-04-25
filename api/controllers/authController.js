var { User } = require('../models/db');
const catchAsyncErrors =require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const user = require('../models/user');

// register a new user
exports.register = catchAsyncErrors(async function(req, res, next) {
  const { username, email, password } = req.body;  
  const newUser = await User.create({ username, email, password });

  sendToken(user, 200, res);
});

exports.login = catchAsyncErrors(async function(req, res, next) {
  const { email, password } = req.body;

  // check if email or password is entered by user
  if (!email || !password) {
    return next(new ErrorHandler('Please enter email and password'), 400);
  }

  // get user
  const user = await User.findOne({ where: { email }});

  if (!user) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  // check if password is correct
  const passwordMatches = await user.checkPassword(password);
  if (!passwordMatches) {
    return next(new ErrorHandler('Invalid email or password',401));
  }

  sendToken(user, 200, res);
});

// forgot password
exports.forgotPassword = catchAsyncErrors( async function(req, res, next) {
  const user = await User.findOne({ where: { email: req.body.email }});
  
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
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return next(new ErrorHandler('email is not sent', 500));
  }
})