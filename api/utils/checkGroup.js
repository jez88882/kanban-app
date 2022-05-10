
async function checkGroup(user, group) {
  const data = await user.getUserGroups();
  let result = false
  data.forEach( usergroup => {
    if (usergroup.dataValues.name === group) {
        result = true
    }
  })
  return result
}

module.exports = checkGroup