const { User } = require('../models/db')

// check if user is admin
async function checkGroup(id, userGroup) {
  console.log('checking group')
  const user = await User.findByPk(id)
  const data = await user.getUserGroups();
  let result = false
  await data.forEach(usergroup=>{
    if (usergroup.dataValues.name === userGroup) {
        result = true
    }
  })

  return result
}

module.exports = checkGroup