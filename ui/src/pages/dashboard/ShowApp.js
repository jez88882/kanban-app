import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Task, Alert, OpenTask } from '../../components'
import { useAppContext } from "../../context/appContext";

const ShowApp = () => {
  const [plans, setPlans] = useState([])
  const [tasks, setTasks] = useState([])
  const [count, setCount] = useState(0)
  const { open, toDo, doing, done, closed } = tasks

  const params = useParams()
  const app_Acronym = params.app_Acronym
  const { showAlert, is_admin } = useAppContext() //to change!!! temp for development


  const fetchPlans = async () => {
    const res = await axios.get(`/api/v1/applications/${app_Acronym}/plans`)
    setPlans(res.data.plans)
  }
  
  const fetchTasks = async () => {
    const res = await axios.get(`/api/v1/applications/${app_Acronym}/tasks`)
    const tasks = res.data.tasks
    const open = []
    const toDo = []
    const doing = []
    const done = []
    const closed = []

    tasks.forEach((task) =>{
      switch (task.Task_state) {
        case "open":
          open.push(task)
          return
        case "toDo":
          toDo.push(task)
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
            
    setTasks({open, toDo, doing, done, closed})
  }
          
  useEffect(()=>{
    fetchPlans()
    fetchTasks()
  },[])
  
  const plansList = plans.map(plan=>
    // <Link to={`/applications/${params.app_Acronym}/plans/${plan.Plan_MVP_name}`} key={plan.Plan_MVP_name} >
      <div key={plan.Plan_MVP_name} className={`border mb-2 px-3 py-1 flex items-center rounded ${plan.closed ? "text-gray-500 bg-gray-200" : ""}`}>
        <p className="text-lg w-1/4">
          {plan.Plan_MVP_name}
        </p>
        <p className="text-lg w-2/4 align-middle">{plan.Plan_startDate} to {plan.Plan_endDate}</p>
      </div>
    // </Link>
  )

  // const openTasks = open.map(task=> <Task key={task.Task_id} task={task} app_Acronym={app_Acronym}/>)
  const listTasks = (tasks) => {
    return tasks.map(task=> <Task key={task.Task_id} task={task} app_Acronym={app_Acronym} moveTask={moveTask}/>)
  }
  
  const OpenTasksList = open ? open.map(task=> <OpenTask key={task.Task_id} task={task} app_Acronym={app_Acronym} moveTask={moveTask}/>) : []
  
  function moveTask(selectTask, sourceName, destinationName) {
    console.log(`moving task from ${sourceName} to ${destinationName}`)
    // // source and destination are Task_idarrays
    setTasks({
      [sourceName]: tasks[sourceName].filter(task => task.Task_id !== selectTask.Task_id),
      [destinationName]: tasks[destinationName].concat(selectTask)
    })
  }

  return (
    <>
      <div className="flex border-b-4 py-8 px-6 items-center	">
        <h1 className='font-bold text-3xl'>Application: {app_Acronym}</h1>
        <Link to="edit" className="btn btn-primary mx-4">Edit App</Link>
      </div>
      {showAlert && <Alert />}
      <div className="m-6">
        <div className={`collapse ${is_admin ? "collapse-open" : ""}`}>
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
                  <Link to="plans/new" className="btn btn-outline btn-primary w-full">
                    Create new plan
                  </Link>
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
                  <Link to="tasks/new" className="btn btn-outline btn-primary w-full">
                    Create new task
                  </Link>
                </div>
            </div>
          </div>
        </div>
        <p className="font-bold text-2xl px-4 my-4">Tasks</p>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3 bg-white p-6 rounded-lg">
            <p className="font-bold text-2xl text-gray-600 mb-2">In progress</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="">
                <p className="font-bold text-gray-600 text-md overflow-y-auto">To-do</p>
                <div className="bg-gray-300 rounded p-2">
                  {toDo && listTasks(toDo)}
                </div>
              </div>
              <div className="">
                <p className="font-bold text-gray-600 text-md">Doing</p>
                <div className="bg-gray-300 rounded p-2 overflow-y-auto">
                {doing && listTasks(doing)}
                </div>
              </div>
              <div className="">
                <p className="font-bold text-gray-600 text-md">Done</p>
                <div className="bg-gray-300 rounded p-2">
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