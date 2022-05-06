const { Op } = require('sequelize')
const dotenv = require('dotenv');

// set up config.env file variables
dotenv.config({path : './config/config.env'});

const { User, Project, UserGroup } = require('./models/db')

async function createGroups(user){
  let member = await UserGroup.create({
    name: 'team member',
    user_id: user.dataValues.id,
  })
  await member.setUser(user)
  await user.addUserGroup(member)
}

async function seedData() {
  await User.destroy({ where: { 
    id: {
      [Op.gt]: 0
    }
  }})
  
  await UserGroup.destroy({ where: { 
    id: {
      [Op.gt]: 0
    }
  }})
  
  // create admin user
  const adminUser = await User.create({
    username: `admin`,
    email: `admin@email.com`,
    password: '123456A!',
  })

  // create users
  for (let i = 2; i < 11; i++) {
    // Runs 5 times, with values of step 0 through 4.
    await User.create({
      username: `user${i}`,
      email: `user${i}@email.com`,
      password: '123456A!',
    })
  }

  // create user group 'team member' for each user
  const users = await User.findAll()

  users.forEach((user) => {
    createGroups(user)
  })

  // create user group 'admin' for first user
  let admin = await UserGroup.create({
    name: 'admin',
    user_id: adminUser.dataValues.id,
  })

  await admin.setUser(adminUser)
  await adminUser.addUserGroup(admin)
}
seedData();
