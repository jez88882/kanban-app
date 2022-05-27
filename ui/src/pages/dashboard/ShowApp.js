import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Task, Alert, OpenTask, Plan, CreateTask } from '../../components'
import { useAppContext } from "../../context/appContext";

const ShowApp = () => {
  const [plans, setPlans] = useState([])
  const [tasks, setTasks] = useState([])
  const [permits, setPermits] = useState({})
  const { Open, toDoList, Doing, Done, Closed } = tasks

  
  const params = useParams()
  const app_Acronym = params.app_Acronym
  const { user, showAlert } = useAppContext() //to change!!! temp for development
  
  const checkPermits = async () => {
    const groupsRes = await axios.get(`/api/v1/groups?user=${user.username}`)
    const appRes = await axios.get(`/api/v1/applications/${app_Acronym}`)
    const { App_permit_Create, App_permit_Open, App_permit_Doing, App_permit_toDoList, App_permit_Done } = appRes.data.app
    const groups = groupsRes.data.groups
    let Create = false
    let Open = false
    let toDoList = false
    let Doing = false
    let Done = false
    groups.forEach(usergroup=> {
      if (usergroup.group === App_permit_Create) {
        Create = true
      }
      if (usergroup.group === App_permit_Open) {
        Open = true
      }
      if (usergroup.group === App_permit_toDoList) {
        toDoList = true
      }
      if (usergroup.group === App_permit_Doing) {
        Doing = true
      }
      if (usergroup.group === App_permit_Done) {
        Done = true
      }
    })
    setPermits({Create, Open, toDoList, Doing, Done})
    console.log('checked permissions')
  }
  const addOpenTask = (task) => {
    const newOpenTasks = tasks.Open.concat(task)
    setTasks({...tasks, Open: newOpenTasks})
  }
  
  const fetchPlans = async () => {
    const res = await axios.get(`/api/v1/applications/${app_Acronym}/plans`)
    setPlans(res.data.plans)
  }
  
  const fetchTasks = async () => {
    const res = await axios.get(`/api/v1/applications/${app_Acronym}/tasks`)
    const tasks = res.data.tasks
    const Open = []
    const toDoList = []
    const Doing = []
    const Done = []
    const Closed = []

    tasks.forEach((task) =>{
      switch (task.Task_state) {
        case "Open":
          Open.push(task)
          return
        case "toDoList":
          toDoList.push(task)
          return
        case "Doing":
          Doing.push(task)
          return
        case "Done":
          Done.push(task)
          return
        case "Closed":
          Closed.push(task)
          return
        default:
          console.log(`no such task state: ${task.Task_state}`)
      }
    })
            
    setTasks({Open, toDoList, Doing, Done, Closed})
  }
          
  useEffect(()=>{
    fetchPlans()
    fetchTasks()
    checkPermits()
  },[])
  
  const plansList = plans.map(plan=>
   <Plan key={plan.Plan_MVP_name} plan={plan} permits={permits}/>
  )

  // const openTasks = open.map(task=> <Task key={task.Task_id} task={task} app_Acronym={app_Acronym}/>)
  const listTasks = (tasks) => {
    return tasks.map(task=> <Task key={task.Task_id} task={task} app_Acronym={app_Acronym} moveTask={moveTask} permits={permits}  username={user.username}/>)
  }
  
  const OpenTasksList = Open ? Open.map(task=> <OpenTask key={task.Task_id} task={task} app_Acronym={app_Acronym} moveTask={moveTask} permits={permits}  username={user.username}/>) : []
  
  function moveTask(selectTask, source, destination) {
    console.log(`moving task from ${source} to ${destination}`)
    // // source and destination are Task_idarrays
    setTasks({
      ...tasks,
      [source]: tasks[source].filter(task => task.Task_id !== selectTask.Task_id),
      [destination]: tasks[destination].concat(selectTask)
    })
  }
  const showPlansAndOpen = permits.Open || permits.Create

  return (
    <>
      <div className="flex border-b-4 py-8 px-6 items-center	">
        <h1 className='font-bold text-3xl'>Application: {app_Acronym}</h1>
        {permits.Open &&
          <Link to="edit" className="btn btn-primary mx-4">Edit App</Link>
        }
      </div>
     
      <div className="m-6">
        <div className={`collapse ${showPlansAndOpen ? "collapse-open" : ""}`}>
          <input type="checkbox" /> 
          <div className="collapse-title border-b-4 mb-4">
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
                    {Open && OpenTasksList}
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
                  {toDoList && listTasks(toDoList)}
                </div>
              </div>
              <div className="mx-2">
                <p className="my-2"><span className="font-bold text-white text-md rounded bg-orange-300 p-2">Doing</span></p>
                <div className="overflow-y-auto">
                {Doing && listTasks(Doing)}
                </div>
              </div>
              <div className="mx-2">
                <p className="my-2"><span className="font-bold text-white text-md rounded bg-emerald-300 p-2">Done</span></p>
                <div className="overflow-y-auto">
                {Done && listTasks(Done)}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-300 p-6 rounded-lg">
            <p className="font-bold text-2xl text-gray-600">Closed</p>
            {Closed && listTasks(Closed)}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowApp;