const ErrorHandler = require('../utils/errorHandler');
const checkGroup = require('../utils/checkGroup');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const { User, UserGroup } = require('../models/db');
const Filter = require('../utils/filters');
const { Op } = require('sequelize');

// users#index
exports.index = catchAsyncErrors( async function(req, res, next) {
    const users = await User.findAll({ where: {
        username: {
            [Op.like]: `%${req.query.username}%`
            }
        }
    });

    res
    .status(200)
    .json({
        success: true,
        data: users
    });
});

// users#show
exports.show = catchAsyncErrors( async function(req, res, next) {
    // Find by user ID
    console.log(`searching for user: ${req.params.username}`)
    const user = await User.findByPk(req.params.username)

    if (!user) {
        return next(new ErrorHandler(`no such user: ${req.params.username}`, 404));
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
    console.log(`updating user: ${req.params.username}`)
    console.log(`logged in user is ${req.user.username}`)

    const isNot_loggedInUser = req.params.id != req.user.id 
    const is_admin = checkGroup(req.user, "admin")
    if (isNot_loggedInUser && !is_admin) {
        return next(new ErrorHandler(`not authorized.`, 403));
    }
    console.log('updating')
    const user = await User.unscoped().findByPk(req.params.username)

    if (req.body.email) {
        user.email = req.body.email
    }
    if (req.body.password) {
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

    const is_admin = checkGroup(req.user, "admin")
    if (!is_admin) {
        return next(new ErrorHandler(`not authorized.`, 403));
    }

    console.log('disabling user')
    await User.update({ is_disabled: 1 }, {
        where: {
          username: req.params.username
        }
      });

    res.json({
        success: true,
        message: 'user disabled'
    });
});

// exports.createUserGroup =  catchAsyncErrors( async function(req, res) {
//     console.log('creating group')
//     console.log(req.body)
//     const { user_id, name } = req.body

//     const usergroup = await UserGroup.create({ user_id, name})
//     console.log(usergroup)

//     const user = await User.findByPk(user_id)
//     await usergroup.setUser(user)
//     res.json({
//         success: true,
//         message: 'ok',
//     })
// });

exports.checkGroup = catchAsyncErrors( async function(req, res, next) {
    const user = await User.findByPk(req.params.username)
    const group = req.query.filter
    const result = await checkGroup(user, group)
    res.json({
        success: true,
        data: result
    })
})
  
exports.userApplications = catchAsyncErrors( async function(req, res, next) {
    const user = await User.findByPk(req.params.username)
    req.chosenUser = user
    next()
})