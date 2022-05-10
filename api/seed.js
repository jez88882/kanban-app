const { Op } = require('sequelize')
const dotenv = require('dotenv');
// Load the full build.
var lodash = require('lodash');

// Load method categories.
var array = require('lodash/array');

// set up config.env file variables
dotenv.config({path : './config/config.env'});

const { User, Application, UserGroup, Plan, Task } = require('./models/db');

// extracted functions
async function createGroups(user){
  let member = await UserGroup.create({
    name: 'team member',
    user_id: user.dataValues.id,
  })
  await member.setUser(user)
  await user.addUserGroup(member)
}

// main seeding area
async function seedData() {
  // await User.destroy({ where: { 
  //   id: {
  //     [Op.gt]: 0
  //   }
  // }})
  
  // await UserGroup.destroy({ where: { 
  //   id: {
  //     [Op.gt]: 0
  //   }
  // }})

  // await Application.destroy({ where: { 
  //   app_Rnumber: {
  //     [Op.gt]: 0
  //   }
  // }})
  
  // create admin user
  const adminUser = await User.create({
    username: `admin`,
    email: `admin@email.com`,
    password: '123456A!',
  })

  // create users
  for (let i = 2; i < 11; i++) {
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

  // create Applications
  for (let i = 1; i < 11; i++) {
    let acronym = ""
    
    for (let n = 0; n < 3; n++) {
      acronym += lodash.sample(['A', 'B', 'C', 'D', 'E', 'F','G','H','I', 'J'])
    }
    acronym += `${i}`

    let start = new Date()
    start.setDate(start.getDate() +  lodash.random(0, 7));

    await Application.create({
      app_Acronym: acronym,
      app_Description: `app ${acronym} is made to be ${i} stars`,
      startDate: start,
      endDate: start.setDate(start.getDate() + 7)
    })
  }

}
// seedData();

async function groupupdate(group, acronym) {
    group.app_Acronym = acronym
    await group.save()
}

// one-time functions
async function oneTime() {
  // const groups = await UserGroup.findAll()
  // const Applications = await Application.findAll()
  // groups.forEach((group)=>{
  //   let proj = lodash.sample(Applications)
  //   let acronym = proj.dataValues.app_Acronym

  //   groupupdate(group, acronym)
  const adminUser = await User.create({
    username: `admin`,
    email: `admin@email.com`,
    password: '123456A!',
  })
}


// oneTime();