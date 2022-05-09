const catchAsyncErrors =require('../middlewares/catchAsyncErrors');

const { User, Project, UserGroup } = require('../models/db')


exports.index = catchAsyncErrors( async function(req, res, next) {
  const projects = await req.user.getProjects() 
  res.status(200).json({
      success: true,
      data: projects
  });
});

exports.show = catchAsyncErrors( async function(req, res, next) {
  console.log(req.params)
  const project = await Project.findByPk(req.params.id)
  res.status(200).json({
      success: true,
      data: project
  });
});

exports.create = catchAsyncErrors( async function(req, res, next) {
  const data = { 
    app_Acronym: req.body.acronym, 
    app_Description: req.body.description, 
    startDate: req.body.startDate, 
    endDate: req.body.endDate }

  
  const project = await Project.create(data)
  res.status(200).json({
      success: true,
      data: project
  });
});

exports.update = catchAsyncErrors( async function(req, res, next) {

  const project = await Project.findByPk(req.params.id)
  console.log(req.params.id)
  console.log(project)

  // const data = { 
  //   app_Acronym: req.body.acronym, 
  //   app_Description: req.body.description, 
  //   startDate: req.body.startDate, 
  //   endDate: req.body.endDate }

  
  // await project.update(data)
  // res.status(200).json({
  //     success: true,
  //     data: project
  // });
  res.send('ok')
});