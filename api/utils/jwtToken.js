// create and send token and save in cookie
async function sendToken(user, statusCode, res) {
  // create JWT 
  const token = user.getJwt();

  //options for cookie
  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24*60*60*1000),
    httpOnly: true
  }

  // need the https custom domain(?)
  // if (process.env.NODE_ENV === 'production') {
  //   options.secure = true
  // }

  const userData = {
    username: user.username,
    email: user.email,
    is_disabled: user.is_disabled,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }

  res.status(statusCode)
  .cookie('token', token, options)
  .json({
    success: true,
    user: userData,
    token
  });
}

module.exports = sendToken;
