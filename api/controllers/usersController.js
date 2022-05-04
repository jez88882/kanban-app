const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const { User } = require('../models/db');
const user = require('../models/user');
const Filter = require('../utils/filters');

// users#index
exports.index = catchAsyncErrors( async function(req, res, next) {
    console.log(req.query)
    const users = await User.findAll({ where: req.query});
    res.status(200).json({
        success: true,
        data: users
    });
});

// users#show
exports.show = catchAsyncErrors(async function(req, res, next) {
    // Find by user ID
    console.log(`searching for user: ${req.params.id}`)
    const user = await User.findByPk(req.params.id)

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
    console.log('updating')
    const user = await User.unscoped().findByPk(req.params.id)
    const authorizedFields = ['email', 'username'];
    // if (user.is_admin) {
    //     authorizedFields.push('password')
    // }
    console.log(req.body)

    user.email=req.body.email
    user.username=req.body.username

    const canChangePassword = req.params.id === req.user.id || req.user.is_admin

    if (req.body.password && canChangePassword) {
        user.password = req.body.password
    }
    user.save()
    res.json({
        success: true,
        message: "updated user",
        data: user
    });
    
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