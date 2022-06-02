import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Task, Alert, OpenTask, Plan, CreateTask } from '../../components'
import { useAppContext } from "../../context/appContext";

const ShowApp = () => {
  const [plans, setPlans] = useState([])
  const [tasks, setTasks] = useState([])
  const [permits, setPermits] = useState({})
  const [isPM, setIsPM] = useState(false)
  const { open, todolist, doing, done, closed } = tasks

  
  const params = useParams()
  const app_Acronym = params.app_Acronym
  const { user } = useAppContext() //to change!!! temp for development

  const checkPM = async() => {
    try {
      const resPM= await axios.get('/api/v1/groups/checkGeneralPM')
      setIsPM(resPM.data.result)
    } catch (error) {
      console.log(error)
    }
  }
  
  const checkPermits = async () => {
    const groupsRes = await axios.get(`/api/v1/groups?user=${user.username}`)
    const appRes = await axios.get(`/api/v1/applications/${app_Acronym}`)
    const { App_permit_Create, App_permit_Open, App_permit_Doing, App_permit_toDoList, App_permit_Done } = appRes.data.app
    const groups = groupsRes.data.groups
    let create = false
    let open = false
    let todolist = false
    let doing = false
    let done = false
    groups.forEach(usergroup=> {
      if (usergroup.group === App_permit_Create) {
        create = true
      }
      if (usergroup.group === App_permit_Open) {
        open = true
      }
      if (usergroup.group === App_permit_toDoList) {
        todolist = true
      }
      if (usergroup.group === App_permit_Doing) {
        doing = true
      }
      if (usergroup.group === App_permit_Done) {
        done = true
      }
    })
    setPermits({create, open, todolist, doing, done})
    console.log('checked permissions')
  }
  const addOpenTask = (task) => {
    const newOpenTasks = tasks.open.concat(task)
    setTasks({...tasks, open: newOpenTasks})
  }
  
  const fetchPlans = async () => {
    const res = await axios.get(`/api/v1/applications/${app_Acronym}/plans`)
    setPlans(res.data.plans)
  }
  
  const fetchTasks = async () => {
    const res = await axios.get(`/api/v1/applications/${app_Acronym}/tasks`)
    const tasks = res.data.tasks
    const open = []
    const todolist = []
    const doing = []
    const done = []
    const closed = []

    tasks.forEach((task) =>{
      switch (task.Task_state) {
        case "open":
          open.push(task)
          return
        case "todolist":
          todolist.push(task)
          return
        case "doing":
          doing.push(task)
          return
        case "done":
          done.push(task)
          return
        case "closed":
          closed.push(task)
          return
        default:
          console.log(`no such task state: ${task.Task_state}`)
      }
    })
            
    setTasks({open, todolist, doing, done, closed})
  }
          
  useEffect(()=>{
    fetchPlans()
    fetchTasks()
    checkPermits()
    checkPM()
  },[])
  
  const plansList = plans.map(plan=>
   <Plan key={plan.Plan_MVP_name} plan={plan} isPM={isPM}/>
  )

  // const openTasks = open.map(task=> <Task key={task.Task_id} task={task} app_Acronym={app_Acronym}/>)
  const listTasks = (tasks) => {
    return tasks.map(task=> <Task key={task.Task_id} task={task} app_Acronym={app_Acronym} moveTask={moveTask} permits={permits}  username={user.username}/>)
  }
  
  const OpenTasksList = open ? open.map(task=> <OpenTask key={task.Task_id} task={task} app_Acronym={app_Acronym} moveTask={moveTask} permits={permits}  username={user.username}/>) : []
  
  function moveTask(selectTask, source, destination) {
    console.log(`moving task from ${source} to ${destination}`)
    // // source and destination are Task_idarrays
    setTasks({
      ...tasks,
      [source]: tasks[source].filter(task => task.Task_id !== selectTask.Task_id),
      [destination]: tasks[destination].concat(selectTask)
    })
  }
  const showPlansAndOpen = isPM || permits.Create

  return (
    <>
      <div className="flex border-b-4 py-8 px-6 items-center	">
        <h1 className='font-bold text-3xl'>Application: {app_Acronym}</h1>
        <Link to="edit" className="btn btn-primary mx-4">{isPM ? "Edit App" : "View App Details"}</Link>
      </div>
     
      <div className="m-6">
        <div className={`collapse ${showPlansAndOpen ? "collapse-open" : ""}`}>
          <input type="checkbox" /> 
          <div className="collapse-title border-b-2 mb-4 shadow-sm">
            <p className="font-bold text-2xl">Plans and Open Tasks</p>
          </div>
          <div className="collapse-content"> 
            <div className="grid grid-cols-2 gap-4 mb-2 ml-2">
              <h3 className="font-bold text-xl">Plans</h3>
              <h3 className="font-bold text-xl">Open Tasks</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-lg h-96 flex flex-col">
                  <div className="px-2 flex items-center">
                    <p className="text-md w-1/4">Plan name</p>
                    <p className="text-md w-2/4 align-middle">Duration</p>
                  </div>
                  <div className="grow overflow-y-auto">
                    {plansList}
                  </div>
                  {permits.Open &&
                  <Link to="plans/new" className="btn btn-outline btn-primary w-full">
                    Create new plan
                  </Link>
                  }
                </div>
              
                <div className="bg-white p-6 rounded-lg h-96 flex flex-col">
                  <div className="flex mr-6 px-3">
                    <p className="text-md w-1/4">Task</p>
                    <p className="text-md w-1/4">Creator</p>
                    <p className="text-md w-1/4">Date created</p>
                  </div>
                  <div className="grow overflow-y-auto">
                    {open && OpenTasksList}
                  </div>
                  {permits.Create &&
                 <CreateTask plans={plans} addOpenTask={addOpenTask} />
                  }
                </div>
            </div>
          </div>
        </div>
        <p className="font-bold text-2xl px-4 my-4">Tasks</p>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3 bg-white p-6 rounded-lg">
            <p className="font-bold text-2xl text-gray-600 mb-2">In progress</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="mx-2">
                <p className="my-2"><span className="font-bold text-white text-md rounded bg-blue-300 p-2">To-do</span></p>
                <div className="overflow-y-auto">
                  {todolist && listTasks(todolist)}
                </div>
              </div>
              <div className="mx-2">
                <p className="my-2"><span className="font-bold text-white text-md rounded bg-orange-300 p-2">Doing</span></p>
                <div className="overflow-y-auto">
                {doing && listTasks(doing)}
                </div>
              </div>
              <div className="mx-2">
                <p className="my-2"><span className="font-bold text-white text-md rounded bg-emerald-300 p-2">Done</span></p>
                <div className="overflow-y-auto">
                {done && listTasks(done)}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-300 p-6 rounded-lg">
            <p className="font-bold text-2xl text-gray-600">Closed</p>
            {closed && listTasks(closed)}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowApp;