const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const { Task } = require('../models/db')

exports.index = catchAsyncErrors( async function( req, res, next) {
  const tasks = await Task.findAll()
  res.json({
    success: true,
    tasks
  })
})

exports.show = catchAsyncErrors( async function( req, res, next) {
  const task = await Task.findByPk(req.params.id)
  res.json({
    success: true,
    task
  })
})

exports.create = catchAsyncErrors( async function( req, res, next) {
  const data = req.body

  const newTask = await Task.create(data)

  res.json({
    success: true,
    newTask
  })
})
