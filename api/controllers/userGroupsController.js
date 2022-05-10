const catchAsyncErrors =require('../middlewares/catchAsyncErrors');
const Sequelize = require('sequelize')
const { UserGroup, User, Application } = require('../models/db')

exports.index = catchAsyncErrors( async function(req, res, next) {
  const apps = await UserGroup.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('app_Acronym')) ,'app_Acronym'],
    ]
  })

  const array = apps.map(app=> {
    return app.dataValues.app_Acronym
  })
  
  res.json({
    success: true,
    apps: array
  })
})

exports.create = catchAsyncErrors( async function(req, res, next) {
  // extract data from body
  const { name, username, app_Acronym} = req.body

  // create the userGroup instance
  const usergroup = await UserGroup.create({ name, username, app_Acronym })
  // set the associations with User and Application
  const user = await User.findbyPk(username)
  const app = await Application.findByPk(app_Acronym)

  await user.addUserGroup(usergroup)
  await app.addUserGroup(usergroup)

  await user.addApplication(app)
  await app.addUser(user)

  res.json({
    success: true,
    data: usergroup
  })
})
