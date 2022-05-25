
async function checkGroup(user, group, app="") {
  console.log(`checking if ${user.username} is ${group} from app:${app}`)
  const checkAdmin = group === "admin"
  const data = await user.getUserGroups({ where: { app_Acronym: app}});
  
  let result = false
  data.forEach( usergroup => {
    const groupMatches = usergroup.dataValues.group === group
    if (groupMatches) {
      result = true
    }
  })
  return result
}

module.exports = checkGroup