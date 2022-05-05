const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const { User, UserGroup } = require('../models/db');
const Filter = require('../utils/filters');
const { Op } = require('sequelize');

// users#index
exports.index = catchAsyncErrors( async function(req, res, next) {
    console.log(req.query.username)
    // const users = await User.findAll({ where: req.query });
    const users = await User.findAll({ where: {
        username: {
            [Op.like]: `%${req.query.username}%`
        }
    }
    });
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
    if (req.params.id != req.user.id||!req.user.is_admin) {
        return next(new ErrorHandler(`not authorized to change other's password. you need to be an admin.`, 403));
    }
    console.log('updating')
    const user = await User.unscoped().findByPk(req.params.id)
    // if (user.is_admin) {
    //     authorizedFields.push('password')
    // }
    console.log(req.body)

    user.email=req.body.email
    user.username=req.body.username

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

exports.createUserGroup =  catchAsyncErrors( async function(req, res) {
    console.log('creating group')
    console.log(req.body)
    const { user_id, name } = req.body

    const usergroup = await UserGroup.build({ user_id, name})
    console.log(usergroup)
    await usergroup.save()

    const user = await User.findByPk(user_id)
    await usergroup.setUser(user)
    
    console.log('getting user:')
    console.log(await usergroup.getUser())
    console.log('========================')
    console.log('getting user groups:')
    console.log(await user.getUserGroups())
    console.log('========================')
    res.json({
        success: true,
        message: 'ok',
    })
});

const checkGroup = require('../utils/checkGroup')

exports.checkUserGroup =  catchAsyncErrors( async function(req, res) {
    console.log('checking group')
    
});
