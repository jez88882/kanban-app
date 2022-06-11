const { User, Task, Application, Plan } = require('../models/db')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const { Op } = require('sequelize')
const checkGroup = require('../utils/checkGroup')
const ErrorHandler = require('../utils/errorHandler')
const sendEmail = require('../utils/sendEmail');


exports.index = catchAsyncErrors( async function( req, res, next) {
  console.log('tasks#index')
  let tasks
  if (req.query.state) {
    if (req.query.state === "") {
      tasks = await Task.findAll()
    } else {
      tasks = await Task.findAll({ 
        where: { 
          Task_state: req.query.state 
        }})
    }
  } else {
    tasks = await Task.findAll({
      where: {
        Task_id: {
          [Op.startsWith]: `${req.app_Acronym}_`,
        }
    }})
  }

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
  console.log('creating task')
  const app = await Application.findByPk(req.app_Acronym)
  const permitted = await checkGroup(req.user, app.App_permit_Create)

  if (!permitted) {
    return next(new ErrorHandler('not permitted to do this action',401))
  }

  const data = req.body
  data.Task_creator = req.user.username
  data.Task_state = "open"
  data.Task_createDate = new Date().toLocaleString()
  data.Task_app_Acronym = req.app_Acronym
  
  const note = {
    creator: req.user.username,
    content: `${req.user.username} created task`,
    createdAt: new Date().toLocaleString(),
    state: data.Task_state
  }
  
  const notes = [note]
  if (data.Task_note !== "") {
    notes.push({
      creator: req.user.username,
      content: data.Task_note,
      createdAt: new Date().toLocaleString(),
      state: data.Task_state
    })
  }

  data.Task_notes = JSON.stringify(notes)

  await app.increment('App_Rnumber')
  await app.reload()
  
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
  
  await task.update({Task_state: "todolist"})
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
    "promote": app.App_permit_Doing, 
    "return": app.App_permit_Doing,
    "confirm": app.App_permit_Done,
    "demote": app.App_permit_Done
  }
  
  let permitted = false
  let authorized = false
  let ownselfCheckOwnself = true
  
  if (["approve", "confirm", "demote"].includes(req.body.action)) {
    authorized = await checkGroup(req.user, permissions[req.body.action])

    if (req.body.action === "approve") {
      // will NOT be checking your own work if you are not the creator
      ownselfCheckOwnself = req.user === task.Task_creator
    } else {
      // req.body.action is "confirm" or "demote"
      // will NOT be checking your own work if you are not the owner
      ownselfCheckOwnself = req.user === task.Task_owner
    }
    // only permitted if user is authorized and you are NOT checking your own work
    permitted = authorized && !ownselfCheckOwnself

  } else {
    permitted = await checkGroup(req.user, permissions[req.body.action], req.app_Acronym)
    
  }
  
  console.log(`permitted: ${permitted}`)
  
  if (!permitted) {
    return next(new ErrorHandler('not permitted to do this action',401))
  }
  
  const stateChanges = {
    "approve": { currentState: "open", newState: "todolist"},
    "work on": { currentState: "todolist", newState: "doing"},
    "promote": { currentState: "doing", newState: "done"},
    "return": { currentState: "doing", newState: "todolist"},
    "confirm": { currentState: "done", newState: "closed"},
    "demote": { currentState: "done", newState: "doing"},
  }
  
  if (task.Task_state !== stateChanges[req.body.action].currentState) {
    return next(new ErrorHandler('task not in the right state',401))
  }

  task.Task_state = stateChanges[req.body.action].newState

  task.Task_owner = req.user.username

  const note = {
    creator: req.user.username,
    content: `${req.user.username}- [${req.body.action}] task`,
    createdAt: new Date().toLocaleString(),
    state: task.Task_state
  }
  
  const notes = JSON.parse(task.Task_notes)
  notes.push(note)
  task.Task_notes = JSON.stringify(notes)

  await task.save()

  if (req.body.action === "promote") {
    const creator = await User.findByPk(task.Task_creator)
    const message = `Hi ${creator.username},\n Task ${task.Task_id}: ${task.Task_name} has been promoted by ${task.Task_owner}. Please proceed to KanbanApp to review the task.\n Thanks`

    try {
      sendEmail({
        email: creator.email,
        subject: `[NOTIFICATION]: Task ${task.Task_id}: ${task.Task_name} promoted`,
        text: message
      })
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
  } 
  res.status(200).json({
    success: true,
    task
  });
})



exports.createNote = catchAsyncErrors( async function( req, res, next) {
  const task = await Task.findByPk(req.params.Task_id)

  const note = {
    creator: req.user.username,
    content: req.body.noteContent,
    createdAt: new Date().toLocaleString(),
    state: task.Task_state
  }
  
  const notes = JSON.parse(task.Task_notes)
  notes.push(note)
  
  task.update({Task_notes: JSON.stringify(notes), Task_owner: req.user.username})
  
  res.json({
    success: true,
    note
  })
})

// API routes
exports.getTaskbyState = catchAsyncErrors( async function( req, res, next) {
  const Task_state = req.paramString('state').toLowerCase()

  if (!Task_state) {
    return next(new ErrorHandler('Error: 305'), 401)
  }

  if (!["open", "todolist", "doing", "done","closed"].includes(Task_state)) {
    return next(new ErrorHandler('Error: 304'), 401)
  }
  const tasks = await Task.findAll({where : { Task_state}})
  
  res.json({
    tasks
  })
})
exports.createTask = catchAsyncErrors( async function( req, res, next) {
  console.log('creating task')
  const Task_app_Acronym = req.bodyString('Task_app_Acronym')
 
  if (!Task_app_Acronym) {
    return next(new ErrorHandler('Error: 305'))
  }
  const app = await Application.findByPk(Task_app_Acronym)

  if (!app) {
    return next(new ErrorHandler('Error: 303'))
  }

  const permitted = await checkGroup(req.user, app.App_permit_Create)

  if (!permitted) {
    return next(new ErrorHandler('Error: 200',401))
  }

  const data = {}
  data.Task_app_Acronym = Task_app_Acronym
  data.Task_name = req.bodyString('Task_name')
  
  if (data.Task_name === "" || !req.bodyString('Task_name')) {
    return next(new ErrorHandler('Error: 305'))
  }
  
  data.Task_description = req.bodyString('Task_description')

  const Task_plan = req.bodyString('Task_plan')
  if (Task_plan) {
    const plan = await Plan.findByPk(Task_plan)
    if (!plan) {
      return next(new ErrorHandler('Error: 302'))
    }

    if (plan.Plan_app_Acronym !== Task_app_Acronym) {
      return next(new ErrorHandler('Error: 306'))
    }

    data.Task_plan = Task_plan
  }

  if (req.bodyString('Task_note')) {
    data.Task_note = req.bodyString('Task_note')
  }

  data.Task_creator = req.user.username
  data.Task_state = "open"
  data.Task_createDate = new Date().toLocaleString()
  
  const note = {
    creator: req.user.username,
    content: `${req.user.username} created task`,
    createdAt: new Date().toLocaleString(),
    state: data.Task_state
  }
  
  const notes = [note]
  if (data.Task_note !== "") {
    notes.push({
      creator: req.user.username,
      content: data.Task_note,
      createdAt: new Date().toLocaleString(),
      state: data.Task_state
    })
  }

  data.Task_notes = JSON.stringify(notes)

  await app.increment('App_Rnumber')
  await app.reload()
  
  data.Task_id =`${app.App_Acronym}_${app.App_Rnumber}`

  const task = await Task.create(data)

  res.json({
    task
  })
});

exports.promote = catchAsyncErrors( async function(req, res, next) {
  console.log('user is trying to promote task')

  const task = await Task.findByPk(req.paramString('Task_id'))

  if (!task) {
    return next(new ErrorHandler('Error: 301'))
  }

  const app = await Application.findByPk(task.Task_app_Acronym)
  
  const permittedGroup = app.App_permit_Doing
  
  let permitted = false
  
  permitted = await checkGroup(req.user, permittedGroup)
  
  if (!permitted) {
    return next(new ErrorHandler('Error: 200',401))
  }
  
  const stateChanges = { currentState: "doing", newState: "done" }
  
  if (task.Task_state !== stateChanges.currentState) {
    return next(new ErrorHandler('Erro: 401', 401))
  }

  task.Task_state = stateChanges.newState

  task.Task_owner = req.user.username

  const note = {
    creator: req.user.username,
    content: `${req.user.username}- [${req.body.action}] task`,
    createdAt: new Date().toLocaleString(),
    state: task.Task_state
  }
  
  const notes = JSON.parse(task.Task_notes)
  notes.push(note)
  task.Task_notes = JSON.stringify(notes)

  await task.save()

  const creator = await User.findByPk(task.Task_creator)
  const message = `Hi ${creator.username},\n Task ${task.Task_id}: ${task.Task_name} has been promoted by ${task.Task_owner}. Please proceed to KanbanApp to review the task.\n Thanks`

  sendEmail({
    email: creator.email,
    subject: `[NOTIFICATION]: Task ${task.Task_id}: ${task.Task_name} promoted`,
    text: message
  })

  res.status(200).json({
    task
  });
    
})