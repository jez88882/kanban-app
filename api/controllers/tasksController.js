const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const { Task, Application } = require('../models/db')
const { Op } = require('sequelize')

exports.index = catchAsyncErrors( async function( req, res, next) {
  const tasks = await Task.findAll({
    where: {
      Task_id: {
        [Op.startsWith]: `${req.app_Acronym}_`,
      }
  }})
  res.json({
    success: true,
    tasks
  })
})

exports.show = catchAsyncErrors( async function( req, res, next) {
  const task = await Task.findByPk(req.params.Task_id)
  res.json({
    success: true,
    task
  })
})

exports.create = catchAsyncErrors( async function( req, res, next) {
  const app = await Application.findByPk(req.app_Acronym)
  const data = req.body
  data.Task_state = "open"
  data.Task_createDate = new Date()

  await app.increment({'App_Rnumber': 1})
  
  data.Task_id =`${app.App_Acronym}_${app.App_Rnumber}`

  const task = await Task.create(data)

  res.json({
    success: true,
    data
  })
})


exports.update = catchAsyncErrors( async function(req, res, next) {

  const task = await Task.findByPk(req.params.Task_id)
  console.log(`updating task ${req.params.Task_id}`)
  
  await task.update(req.body)
  res.status(200).json({
      success: true,
      task
  });
});

exports.approve = catchAsyncErrors( async function(req, res, next) {

  const task = await Task.findByPk(req.params.Task_id)
  console.log(`approving task ${req.params.Task_id}`)
  
  await task.update({Task_state: "toDo"})
  res.status(200).json({
      success: true,
      task
  });
});
