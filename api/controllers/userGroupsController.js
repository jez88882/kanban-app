const catchAsyncErrors =require('../middlewares/catchAsyncErrors');
const Sequelize = require('sequelize')
const { UserGroup, User, Application } = require('../models/db');
const user = require('../models/user');

exports.index = catchAsyncErrors( async function(req, res, next) {
  const groups = await UserGroup.findAll({
    where: { 
      username: req.user.username,
      name: req.query.name
    },
    attributes: ['app_Acronym']
  })

  const existingApps = await Application.findAll({attributes: ['app_Acronym']})
  // const uncreatedApps = groups
  console.log(groups)
  console.log(existingApps)

  const apps = groups.map(group=> group.dataValues.app_Acronym)
  res.json({
    success: true,
    apps
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
