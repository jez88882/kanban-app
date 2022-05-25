const catchAsyncErrors =require('../middlewares/catchAsyncErrors')
const { Op } = require('sequelize')
const { User, Application, UserGroup } = require('../models/db')

exports.index = catchAsyncErrors( async function(req, res, next) {
  let apps
  if (req.chosenUser) {
    apps = req.chosenUser.getApplications()
  } else {
    apps = await Application.findAll()
  }
  res.json({
    success:true,
    apps
  })
});

exports.userProjects = catchAsyncErrors( async function(req, res, next) {
  const projects = await req.user.getProjects() 
  res.status(200).json({
      success: true,
      data: projects
  });
});

exports.show = catchAsyncErrors( async function(req, res, next) {
  const app = await Application.findByPk(req.params.app_Acronym)
  res.status(200).json({
      success: true,
      app
  });
});

exports.create = catchAsyncErrors( async function(req, res, next) {
  req.body.App_Rnumber = 0
  const app = await Application.create(req.body)  

  res.status(200).json({
      success: true,
      app
  });
});

exports.update = catchAsyncErrors( async function(req, res, next) {

  const app = await Application.findByPk(req.params.app_Acronym)
  console.log(`updating ${req.params.app_Acronym}`)
  
  await app.update(req.body)
  res.status(200).json({
      success: true,
      app
  });
});