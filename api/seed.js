const { Op } = require('sequelize')
const dotenv = require('dotenv');
var lodash = require('lodash');
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

  // clear previous seeds
  await User.destroy({
    truncate: true
  });
  
  await UserGroup.destroy({
    truncate: true
  });

  await Application.destroy({
    truncate: true
  });

  await Plan.destroy({
    truncate: true
  });

  await Task.destroy({
    truncate: true
  });
  
  // create admin user
  const adminUser = await User.create({
    email: `admin@email.com`,
    username: `admin`,
    password: '123456A!',
  })

  // create 12 users (3 of each usergroup)
  // 8 users to be assigned to one app each (2 apps total)
  // 4 users for free testing
  for (let i = 1; i < 4; i++) {
    const proj_manager = `proj_manager${i}`
    const proj_lead = `proj_lead${i}`
    const team_member = `team_member${i}`
    
    await User.create({
      username: proj_manager,
      email: `${proj_manager}@email.com`,
      password: '123456A!',
    })
    
    await User.create({
      username:  proj_lead,
      email: `${proj_lead}@email.com`,
      password: '123456A!',
    })
    
    await User.create({
      username: team_member,
      email: `${team_member}@email.com`,
      password: '123456A!',
    })
    
  }
  
  for (let i = 1; i < 3; i++) {
    const proj_manager = `proj_manager${i}`
    const proj_lead = `proj_lead${i}`
    const team_member = `team_member${i}`
    const app_Acronym = `APP${i}`
    await UserGroup.create({ group: "project manager", username: proj_manager, app_Acronym })
    await UserGroup.create({ group: "project lead", username: proj_lead, app_Acronym })
    await UserGroup.create({ group: "team member", username: team_member, app_Acronym })
  }
  const endingdate = new Date() + 14
  // create 1 app
  const appDetails = {
    App_Acronym: 'APP1',
    App_Description: 'this is the first app, everything is fully created- 3 of each task state. a full team is assigned to it.',
    startDate: new Date().toLocaleDateString(),
    endDate: endingdate.toLocaleDateString(),
    App_permit_Create: 'project lead',
    App_permit_Open: 'project manager',
    App_permit_toDo: 'team member',
    App_permit_Doing: 'team member',
    App_permit_Done: 'project lead',
  }

  await Application.create(appDetails)

  const planStart = new Date() + 1
  const planEnd = new Date() + 8
  // create 2 plans
  const plan1 = {
    Plan_MVP_name: 'plan1',
    Plan_startDate: planStart.toLocaleDateString(),
    Plan_endDate: planEnd.toLocaleDateString(),
    Plan_app_Acronym: 'APP1',
  }
  await Plan.create(plan1)
  
  
  const plan2Start = new Date() + 3
  const plan2End = new Date() + 9
  const plan2 = {
    Plan_MVP_name: 'plan2',
    Plan_startDate:plan2Start.toLocaleDateString(),
    Plan_endDate: plan2End.toLocaleDateString(),
    Plan_app_Acronym: 'APP1',
  }
  await Plan.create(plan2)

  const app = Application.findByPk('APP1')
  // create 2 of each task, 1 of which will be assigned to a plan
  ['open', 'toDo', 'doing', 'done', 'closed'].map(async (state) => {
    
    let teamMember
    if (state !== 'open') {
      teamMember = 'team_member1'
    }

    const task1 = {
      Task_name: `${state} Task1`,
      Task_description: `this is ${state} task one`,
      Task_plan: 'plan1',
      Task_creator: 'proj_lead1',
      Task_state: state,
      Task_createDate: new Date().toLocaleString(),
      Task_owner: teamMember || ''
    }
  
    const note = {
      creator: 'proj_lead1',
      content: 'proj_lead1 created task',
      createdAt: new Date().toLocaleString(),
      state
    }
  
    task1.Task_notes = JSON.stringify([note])
  
    await app.increment({'App_Rnumber': 1})
    
    task1.Task_id =`APP1_${app.App_Rnumber}`
  
    await Task.create(task1)
  
    const task2 = {
      Task_name: `${state} Task2`,
      Task_description: `this is the second *${state}* task. not assigned to any plan`,
      Task_plan: '',
      Task_creator: 'proj_lead1',
      Task_state: state,
      Task_createDate: new Date().toLocaleString(),
      Task_owner: teamMember || ''
    }
  
    const note2 = {
      creator: 'proj_lead1',
      content: 'proj_lead1 created task',
      createdAt: new Date().toLocaleString(),
      state
    }
  
    task2.Task_notes = JSON.stringify([note2])
  
    await app.increment({'App_Rnumber': 1})
    
    task2.Task_id =`APP1_${app.App_Rnumber}`
  
    await Task.create(task2)
  })


}
seedData();

// one-time functions
async function oneTime() {
  // const admingroup = await UserGroup.findOne({where: { name: 'admin' }})
  // const adminuser = await User.findOne({where: { username: 'admin' }})
  // const grps = await user.getUserGroups()
  // await user.addUserGroup(admingroup)
  // console.log(grps)
}


// oneTime();