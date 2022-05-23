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

exports.workOn = catchAsyncErrors( async function(req, res, next) {
  const task = await Task.findByPk(req.params.Task_id)
  console.log(`${req.user.usernam} working on task ${req.params.Task_id}`)
  await task.update({Task_state: "doing", Task_owner: req.user.username})
  res.status(200).json({
    success: true,
      task
  });
});

exports.createNote = catchAsyncErrors( async function( req, res, next) {
  const task = await Task.findByPk(req.params.Task_id)
  console.log(req.body)

  const note = {
    creator: req.user.username,
    content: req.body.noteContent,
    createdAt: new Date(),
    state: task.Task_state
  }

  const notes = JSON.parse(task.Task_notes)
  console.log('before')
  console.log(notes)
  notes.push(note)
  console.log('after')
  console.log(notes)

  task.update({Task_notes: JSON.stringify(notes)})

  res.json({
    success: true,
    task
  })
})