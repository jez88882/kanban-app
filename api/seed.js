const { Op } = require('sequelize')
const dotenv = require('dotenv');
var lodash = require('lodash');
var array = require('lodash/array');

// set up config.env file variables
dotenv.config({path : './config/config.env'});

const { User, Application, UserGroup, Plan, Task } = require('./models/db');

// main seeding area
async function seedData() {
  await UserGroup.create({
    group: 'admin',
    username: 'admin'
  })
  console.log('creating usergroups...')
  for (let i = 1; i < 3; i++) {
    const proj_manager = `proj_manager${i}`
    const proj_lead = `proj_lead${i}`
    const team_member = `team_member${i}`
    const app_Acronym = `APP${i}`
    await UserGroup.create({ group: `${app_Acronym}-project manager`, username: proj_manager})
    await UserGroup.create({ group: `${app_Acronym}-project lead`, username: proj_lead})
    await UserGroup.create({ group: `${app_Acronym}-team member`, username: team_member})
  }
  console.log('created usergroups')
  /** 
  // clear previous seeds
  await Task.destroy({
    truncate: true
   });
  
  await Plan.destroy({
    truncate: true
  });
  await User.destroy({
    truncate: true
  });
  
  await UserGroup.destroy({
    truncate: true
  });
  
  await Application.destroy({
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
  
  const endingdate = new Date() + 14
  // create 1 app
  console.log('creating app...')
  const appDetails = {
    App_Acronym: 'APP1',
    App_Description: 'this is the first app, everything is fully created- 3 of each task state. a full team is assigned to it.',
    startDate: new Date().toLocaleString(),
    endDate: endingdate.toLocaleString(),
    App_permit_Create: 'APP1-project lead',
    App_permit_Open: 'APP1-project manager',
    App_permit_toDoList: 'APP1-team member',
    App_permit_Doing: 'APP1-team member',
    App_permit_Done: 'APP1-project lead',
  }
  
  await Application.create(appDetails)
  console.log('created app')
  
  console.log('creating plans...')
  const planStart = new Date() + 1
  const planEnd = new Date() + 8
  // create 2 plans
  const plan1 = {
    Plan_MVP_name: 'plan1',
    Plan_description: 'this is the first plan for the APP1',
    Plan_startDate: planStart.toLocaleString(),
    Plan_endDate: planEnd.toLocaleString(),
    Plan_app_Acronym: 'APP1',
  }
  await Plan.create(plan1)
  
  
  const plan2Start = new Date() + 3
  const plan2End = new Date() + 9
  const plan2 = {
    Plan_MVP_name: 'plan2',
    Plan_description: 'this is the next/second plan for the first app',
    Plan_startDate:plan2Start.toLocaleString(),
    Plan_endDate: plan2End.toLocaleString(),
    Plan_app_Acronym: 'APP1',
  }
  await Plan.create(plan2)
  console.log('created plans')
  
  const app = await Application.findByPk('APP1')
  
  // create 2 of each task, 1 of which will be assigned to a plan
  const states = ['open', 'toDo', 'doing', 'done', 'closed']
  
  //idk if this would work...
  await mapping(states, async (state) => {
    // const state = 'closed'
    console.log(`now creating tasks of state: ${state}`)
    
    let teamMember
    switch (state) {
      case 'open':
        teamMember = ''
        break
        case 'toDo':
          teamMember = 'proj_manager1'
        break
      default:
        teamMember = 'team_member1'
      }
      
    console.log(`team member is now: ${teamMember}`)
    const task1 = {
      Task_name: `${state} Task1`,
      Task_description: `this is ${state} task one`,
      Task_plan: 'plan1',
      Task_creator: 'proj_lead1',
      Task_state: state,
      Task_createDate: new Date().toLocaleString(),
      Task_owner: teamMember
    }
    console.log(task1)
    
    const note = {
      creator: 'proj_lead1',
      content: 'proj_lead1 created task',
      createdAt: new Date().toLocaleString(),
      state
    }
    console.log(note)
    
    task1.Task_notes = JSON.stringify([note])
    task1.Task_id =`APP1_${app.App_Rnumber}`
    
    await Task.create(task1)
    console.log(`created first ${state} task`)

    console.log(`app Rnumber is now ${app.App_Rnumber}`)
    console.log('incrementing...')
    await app.increment({'App_Rnumber': 1})
    await app.reload()
    console.log(`app Rnumber is now ${app.App_Rnumber}`)
    
    const task2 = {
      Task_name: `${state} Task2`,
      Task_description: `this is the second *${state}* task. not assigned to any plan`,
      Task_plan: '',
      Task_creator: 'proj_lead1',
      Task_state: state,
      Task_createDate: new Date().toLocaleString(),
      Task_owner: teamMember
    }
    
    const note2 = {
      creator: 'proj_lead1',
      content: 'proj_lead1 created task',
      createdAt: new Date().toLocaleString(),
      state
    }
    
    task2.Task_notes = JSON.stringify([note2])
    
    task2.Task_id =`APP1_${app.App_Rnumber}`
    await Task.create(task2)
    
    console.log(`app Rnumber is now ${app.App_Rnumber}`)
    console.log('incrementing...')
    await app.increment('App_Rnumber')
    await app.reload()
    console.log(`app Rnumber is now ${app.App_Rnumber}`)
    
    
    console.log(`created 2 tasks of state: ${state}`)
  })
  */
  console.log('done')
  return

}
seedData();

// one-time functions
// async function oneTime() {
// }


// oneTime();

//idk if this would work...
async function mapping(array, callback){
  array.forEach(callback)
}