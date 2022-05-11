const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const { Plan } = require('../models/db')

exports.index = catchAsyncErrors( async function( req, res, next) {
  const plans = await Plan.findAll()
  res.json({
    success: true,
    plans
  })
})

exports.show = catchAsyncErrors( async function( req, res, next) {
  const plan = await Plan.findByPk(req.params.id)
  res.json({
    success: true,
    plan
  })
})

exports.create = catchAsyncErrors( async function( req, res, next) {
  const data = req.body

  const newPlan = await Plan.create(data)

  res.json({
    success: true,
    newPlan
  })
})
