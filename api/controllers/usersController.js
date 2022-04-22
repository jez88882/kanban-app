const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const { User } = require('../models/db');

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
    const hashed = hash(req.body.password);
    const userDetails = {
        username: req.body.username,
        email: req.body.email,
        password: hashed
    };

    const newuser = await User.create(userDetails);
    res.json({
        success: true,
        message: 'user created',
        data: newUser
    });
});

// users#update
exports.update = catchAsyncErrors( async function(req, res, next) {

    const user = await User.findAll({ where: { 
        id: req.params.id
    }})[0];

    const hashed = hash(req.body.password);

    const newUserDetails = {
        username: req.body.username,
        email: req.body.email,
        password: hashed
    };

    const updatedUser = await user.update(newUserDetails);
    res.json({
        success: true,
        message: "updated user",
        data: updatedUser
    })
});

// users#disable
exports.disable = catchAsyncErrors( async function(req, res) {
    const user = await User.findAll({ where: { 
        id: req.params.id
    } })[0];
    const disabledUser = user.update({ is_disabled: 1 });
    console.log(disabledUser);
    res.json({
        success: true,
        message: 'user disabled',
        data: disabledUser
    });
});

exports.test = catchAsyncErrors( async function(req, res, next) {
    const userDetails = {
        email: req.body.email,
        password: "dfad"
    };
    const newUser = await User.create(userDetails);
    res.json({
        success: true,
        data: newUser
    })
});