const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const { User } = require('../models/db');
const user = require('../models/user');

// users#index
exports.index = catchAsyncErrors( async function(req, res, next) {
    const users = await User.findAll();
    res.status(200).json({
        success: true,
        data: users
    });
});

// users#show
exports.show = catchAsyncErrors(async function(req, res, next) {
    // Find by user ID
    const user = await User.findAll({ where: { 
        id: req.params.id
    } })[0];

    if (!user) {
        return next(new ErrorHandler(`no such user: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

// users#create
exports.create = catchAsyncErrors( async function(req, res) {
    console.log('creating user')
    const userDetails = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    const user = await User.create(userDetails);
    res.json({
        success: true,
        message: 'user created',
        data: user
    });
    console.log('user created')
});

// users#update
exports.update = catchAsyncErrors( async function(req, res, next) {
    const newInfo = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    const authorizedFields = ['email', 'password'];
    if (user.is_admin) {
        authorizedFields.push('username')
    }

    const updatedUser = await user.update(newInfo, { 
        fields: authorizedFields,
        where: { id: req.body.id }
    });

    res.json({
        success: true,
        message: "updated user",
        data: updatedUser
    })
});

// users#disable
exports.disable = catchAsyncErrors( async function(req, res) {
    await User.update({ is_disabled: 1 }, {
        where: {
          id: req.params.id
        }
      });

    res.json({
        success: true,
        message: 'user disabled'
    });
});


function getAuthorizedfields() {

}