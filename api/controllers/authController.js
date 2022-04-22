var { User } = require('../models/db');
const catchAsyncErrors =require('../middlewares/catchAsyncErrors');

// register a new user
exports.registerUser = catchAsyncErrors(async function(req, res, next) {
  const { username, email, password } = req.body;
  
  console.log( req.originalUrl);
  console.log( req.body);
  
  // console.log(req.headers);
  // const newUser = await User.create({ username, email, password });
  // res.status(200).json({
  //     success: true,
  //     message: 'user registered',
  //     data: newUser
  // });
});