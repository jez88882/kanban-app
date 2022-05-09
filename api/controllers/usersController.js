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
    console.log(`logged in user is ${req.params.id}`)
    console.log(`logged in user is ${req.user.id}`)
    if (req.params.id != req.user.id && !req.user.is_admin) {
        return next(new ErrorHandler(`not authorized to change other's password. you need to be an admin.`, 403));
    }
    console.log('updating')
    const user = await User.unscoped().findByPk(req.params.id)

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
    console.log('disabling user')
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

    const usergroup = await UserGroup.create({ user_id, name})
    console.log(usergroup)

    const user = await User.findByPk(user_id)
    await usergroup.setUser(user)
    res.json({
        success: true,
        message: 'ok',
    })
});

exports.userGroups = catchAsyncErrors(async function(req, res, next) {
    console.log('checking group in users controller')
    const user = await User.findByPk(req.params.id)
    const group = req.query.filter
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
  
