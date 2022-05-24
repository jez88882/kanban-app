const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const checkGroup = require('../utils/checkGroup')
const { Task, Application } = require('../models/db')
const { Op } = require('sequelize')
const ErrorHandler = require('../utils/errorHandler')

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
  data.Task_createDate = new Date().toLocaleString()
  
  const note = {
    creator: req.user.username,
    content: `${req.user.username} created task`,
    createdAt: new Date().toLocaleString(),
    state: task.Task_state
  }

  data.Task_notes = JSON.stringify([note])

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

exports.changeState = catchAsyncErrors( async function(req, res, next) {
  const task = await Task.findByPk(req.params.Task_id)
  const app = await Application.findByPk(req.app_Acronym) 

  const { currentState , newState } = req.body

  const permitState = {
    /**
      "newState": {
      "currentState": authorizedUserGroup
      }
     */
    "toDo": {
      "open": app.App_permit_Open, //approve
      "doing": app.App_permit_toDo, // return
    },
    "doing": {
      "toDo": app.App_permit_toDo, //work on
      "done": app.App_permit_Done,
    },
    "done": {
      "doing": app.App_permit_Doing,
    },
    "closed": {
      "done": app.App_permit_Done
    }
  }

  // check if permitted
  const authorizedGroup = permitState[newState][currentState]

  if (!authorizedGroup) {
    return next(new ErrorHandler('against the workflow', 401));
  }

  const is_authorized = checkGroup(req.user, authorizedGroup, app.App_Acronym)

  if (!is_authorized) {
    return next(new ErrorHandler('not authorized', 401));
  }

  await task.update({Task_state: newState, Task_owner: req.user.username})
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
    createdAt: new Date().toLocaleString(),
    state: task.Task_state
  }

  const notes = JSON.parse(task.Task_notes)
  notes.push(note)
  console.log('stringified notes:')
  console.log(JSON.stringify(notes))

  task.update({Task_notes: JSON.stringify(notes)})

  res.json({
    success: true,
    note
  })
})