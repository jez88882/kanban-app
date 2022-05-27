const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const { Plan } = require('../models/db')

exports.index = catchAsyncErrors( async function( req, res, next) {
  const plans = await Plan.findAll({where: { Plan_app_Acronym: req.app_Acronym}})
  res.json({
    success: true,
    plans
  })
})

exports.show = catchAsyncErrors( async function( req, res, next) {
  const plan = await Plan.findByPk(req.params.MVP_name)
  console.log( plan)
  res.json({
    success: true,
    plan
  })
})

exports.create = catchAsyncErrors( async function( req, res, next) {
  const data = req.body
  const plan = await Plan.create(data)

  res.json({
    success: true,
    plan
  })
})

exports.update = catchAsyncErrors( async function( req, res, next) {
  const data = req.body

  const plan = await Plan.findByPk(req.params.MVP_name)
  await plan.update(data)
  res.json({
    success: true,
    plan
  })
})

exports.close = catchAsyncErrors( async function( req, res, next) {
  const data = req.body

  const plan = await Plan.findByPk(req.params.MVP_name)
  await plan.update({closed: 1})
  res.json({
    success: true,
    plan
  })
})

