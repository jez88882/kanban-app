const catchAsyncErrors =require('../middlewares/catchAsyncErrors');
const sequelize = require('sequelize')
const { UserGroup, User, Application } = require('../models/db');
const user = require('../models/user');

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
  // extract data from body
  const { name, username, app_Acronym} = req.body
  console.log(req.body)
  // create the userGroup instance
  const usergroup = await UserGroup.create({ name, username, app_Acronym })
  
  res.json({
    success: true,
    // data: usergroup
  })
})
