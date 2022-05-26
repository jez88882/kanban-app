const { UserGroup } = require("../models/db")

async function checkGroup(user, group) {
  console.log(`checking if ${user.username} is ${group}`)
  let result = false
  const data = await UserGroup.findOne({ where: {
    username: user.username,
    group
  }})
  if (data) {
    result = true 
  }
  console.log(`${user.username} is ${result ? "": "NOT"} ${group}`)
  return result
}

module.exports = checkGroup