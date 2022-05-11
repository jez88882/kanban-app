const catchAsyncErrors =require('../middlewares/catchAsyncErrors');

const { User, Application, UserGroup } = require('../models/db')


exports.index = catchAsyncErrors( async function(req, res, next) {
  let apps
  if (req.chosenUser) {
    console.log('re fsa')
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
  console.log(req.params)
  const project = await Application.findByPk(req.params.id, {
    include: [{
      model: UserGroup,
      attributes: ['name', 'user_id']
    }]
  })
  console.log(project)
  res.status(200).json({
      success: true,
      data: project
  });
});

exports.create = catchAsyncErrors( async function(req, res, next) {
  const { 
    app_Acronym, 
    app_Description, 
    startDate, 
    endDate } = req.body
  
  const app = await Application.create({ app_Acronym, app_Description, startDate, endDate })

  await req.user.addApplication(app)
  res.status(200).json({
      success: true,
      app
  });
});

exports.update = catchAsyncErrors( async function(req, res, next) {

  const project = await Application.findByPk(req.params.id)
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