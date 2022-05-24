
async function checkGroup(user, group, app="") {
  console.log(`checking ${group} from app:${app}`)
  const data = await user.getUserGroups();
  const checkAdmin = group === "admin"
  
  let result = false
  data.forEach( usergroup => {
    const groupMatches = usergroup.dataValues.name === group
    const appMatches = usergroup.dataValues.app_Acronym === app
  
    if (groupMatches) {
      if (appMatches || checkAdmin) {
        result = true
      }
    }
  })
  return result
}

module.exports = checkGroup