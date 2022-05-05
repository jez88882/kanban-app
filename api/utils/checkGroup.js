const { User } = require('../models/db') 

async function checkGroup(userId, group) {
  console.log('check group funciton')
  const user = await User.findByPk(userId)
  const project_users = await user.getProjectUsers()

  return project_users.filter(project=>{
    return project.dataValues[group] === true
    // console.log(group)
    // console.log(project.dataValues[group])
  })
}

module.exports = checkGroup