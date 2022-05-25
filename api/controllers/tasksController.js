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
    state: data.Task_state
  }

  data.Task_notes = JSON.stringify([note])

  await app.increment({'App_Rnumber': 1})
  
  data.Task_id =`${app.App_Acronym}_${app.App_Rnumber}`

  const task = await Task.create(data)

  res.json({
    success: true,
    task
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
  console.log(`user is trying to ${req.body.action} task`)

  const task = await Task.findByPk(req.params.Task_id)
  const app = await Application.findByPk(req.app_Acronym)
  
  const permissions = {
    "approve": app.App_permit_Open,
    "work on": app.App_permit_toDoList,
    "promote": task.Task_owner === req.user.username, 
    "return": task.Task_owner === req.user.username,
    "confirm": app.App_permit_Done,
    "demote": app.App_permit_Done
  }
  
  let permitted = false
  let authorized = false
  let ownselfCheckOwnself = true
  
  if (["approve", "confirm", "demote"].includes(req.body.action)) {
    authorized = await checkGroup(req.user, permissions[req.body.action], req.app_Acronym)
    
    if (req.body.action === "approve") {
      // will NOT be checking your own work if you are not the creator
      ownselfCheckOwnself = req.user !== task.Task_creator
    } else {
      // req.body.action is "confirm" or "demote"
      // will NOT be checking your own work if you are not the owner
      ownselfCheckOwnself = req.user !== task.Task_owner
    }
    // only permitted if user is authorized and you are NOT checking your own work
    permitted = authorized && !ownselfCheckOwnself

  } else if (req.body.action === "work on") {
    permitted = await checkGroup(req.user, permissions[req.body.action], req.app_Acronym)
    
  } else {
    // permitted if you are the owner of the task
    permitted = permissions[req.body.action]
  }
  
  console.log(`permitted: ${permitted}`)
  
  if (!permitted) {
    return next(new ErrorHandler('not permitted to do this action',401))
  }
  
  const stateChanges = {
    "approve": { currentState: "open", newState: "toDo"},
    "work on": { currentState: "toDo", newState: "doing"},
    "promote": { currentState: "doing", newState: "done"},
    "return": { currentState: "doing", newState: "toDo"},
    "confirm": { currentState: "done", newState: "closed"},
    "demote": { currentState: "done", newState: "doing"},
  }
  
  if (task.Task_state !== stateChanges[req.body.action].currentState) {
    return next(new ErrorHandler('task not in the right state',401))
  }

  task.Task_state = stateChanges[req.body.action].newState

  if (req.body.action === "work on") {
    task.Task_owner = req.user.username
  }
  
  if (req.body.action === "return") {
    task.Task_owner = ""
  }

  await task.save()
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