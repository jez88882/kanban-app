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

  res.status(statusCode)
  .cookie('token', token, options)
  .json({
    success: true,
    user,
    token
  });
}

module.exports = sendToken;
