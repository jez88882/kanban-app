const catchAsyncErrors =require('../middlewares/catchAsyncErrors');
const sequelize = require('sequelize')
const ErrorHandler = require('../utils/errorHandler')
const { UserGroup } = require('../models/db');

exports.index = catchAsyncErrors( async function(req, res, next) {
  let groups
  if (req.query.user) {
    groups = await UserGroup.findAll({where: {username : req.query.user}})
  } else {
    groups = await UserGroup.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('group')), 'group']
      ]
    })
  }
  res.json({
    success: true,
    groups
  })
})

exports.create = catchAsyncErrors( async function(req, res, next) {
  // check if group x username already exists
  const userGroupExists = await UserGroup.findOne({ 
    where: req.body
  })
  
  if (userGroupExists) {
    return next(new ErrorHandler('User has already been assigned', 401));
  }

  // create the userGroup instance
  const usergroup = await UserGroup.create(req.body)
  
  res.json({
    success: true,
    usergroup
  })
})

exports.checkCreateApp = catchAsyncErrors( async function(req, res, next) {

  const isPM = await UserGroup.findOne({
    where: {
      username: req.user.username,
      group: {
        [sequelize.Op.endsWith]: 'project manager',
      }
    }
  })

  const result = isPM ? true : false

  res.json({
    success: true,
    result
  })
})

