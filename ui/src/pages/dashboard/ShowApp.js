import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const initialState = {
  plans: [],
  tasks: [],
}


const ShowApp = () => {
  const params = useParams()
  const [values, setValues] = useState(initialState)
  
  const fetchPlans = async () => {
    const res = await axios.get(`/api/v1/applications/${params.app_Acronym}/plans`)
    setValues({...values, plans: res.data.plans})
  }

  const fetchTasks = async () => {
    const res = await axios.get(`/api/v1/applications/${params.app_Acronym}/tasks`)
    setValues({...values, tasks: res.data.tasks})
  }
  
  useEffect(()=>{
    fetchPlans();
    fetchTasks();
  },[])
  
  const plansList = values.plans.map(plan=>
    <Link to={`/applications/${params.app_Acronym}/plans/${plan.Plan_MVP_name}`} key={plan.Plan_MVP_name} >
      <div className={`border mb-2 px-3 py-1 flex items-center rounded ${plan.closed ? "text-gray-500 bg-gray-200" : ""}`}>
        <p className="text-lg w-1/4">
          {plan.Plan_MVP_name}
        </p>
        <p className="text-lg w-2/4 align-middle">{plan.Plan_startDate} to {plan.Plan_endDate}</p>
      </div>
    </Link>
  )

  const tasksList = values.tasks.map(task=>
    <Link to={`/applications/${params.app_Acronym}/tasks/${task.Task_id}`} key={task.Task_id} >
      <div className="border mb-2 px-3 py-1 flex justify-between rounded items-center">
        <div className="w-2/4">
          <p className="text-lg">{task.Task_name}</p>
          <p className="text-sm text-slate-500">{task.Task_creator}</p>
        </div>
        <p className="w-1/4">{task.Task_createDate}</p>
        <button className="btn btn-info w-1/4">Approve</button>
      </div>
    </Link>
  )
  
  return (
    <>
      <div className="flex border-b-4 py-8 px-6 items-center	">
        <h1 className='font-bold text-3xl'>Application: {params.app_Acronym}</h1>
        <Link to="edit" className="btn btn-primary mx-4">Edit App</Link>
      </div>
      <div className="grid grid-cols-2 gap-4 m-6">
        <div>
          <p className="font-bold text-2xl px-4">Plans</p>
          <div className="bg-white p-6 rounded-lg">
            <div className="px-2 flex items-center">
              <p className="text-md w-1/4">Plan name</p>
              <p className="text-md w-2/4 align-middle">Duration</p>
            </div>
            <div>
              {plansList}
            </div>
            <Link to="plans/new" className="btn btn-outline btn-primary w-full">
              Create new plan
            </Link>
          </div>
        </div>
        <div>
          <p className="font-bold text-2xl px-4">Open Tasks</p>
          <div className="bg-white p-6 rounded-lg">
            <div className="px-2 flex items-center">
              <p className="text-md w-2/4">Task</p>
              <p className="text-md w-1/4 align-middle">Date created</p>
            </div>
            <div>
              {tasksList}
            </div>
            <Link to="tasks/new" className="btn btn-outline btn-primary w-full">
              Create new task
            </Link>
          </div>
        </div>
      </div>
      <p className="font-bold text-2xl px-6">Tasks</p>
      <div className="grid grid-cols-4 gap-4 my-4 mx-3">
        <div className="col-span-3 bg-white p-6 rounded-lg">
          <p className="font-bold text-2xl text-gray-600 mb-2">In progress</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="">
              <p className="font-bold text-gray-600 text-md">To-do</p>
              <div className="bg-gray-300 rounded p-2">
                tasks here
              </div>
            </div>
            <div className="">
              <p className="font-bold text-gray-600 text-md">Doing</p>
              <div className="bg-gray-300 rounded p-2">
                tasks here
              </div>
            </div>
            <div className="">
              <p className="font-bold text-gray-600 text-md">Done</p>
              <div className="bg-gray-300 rounded p-2">
                tasks here
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-300 p-6 rounded-lg">
          <p className="font-bold text-2xl text-gray-600">Closed</p>
        </div>
      </div>
    </>
  );
};

export default ShowApp;