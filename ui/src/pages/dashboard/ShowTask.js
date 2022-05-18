import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Alert } from '../../components'
import axios from 'axios'
import { useAppContext } from '../../context/appContext'
import { FormRow } from '../../components'


const ShowTask = () => {
  const params = useParams()
  const { displayAlert, showAlert, clearAlert } = useAppContext()
  
  
  const [values, setValues] = useState({})
  
  const fetchTask = async () => {
    const res = await axios.get(`/api/v1/applications/${params.app_Acronym}/tasks/${params.Task_id}`)
    console.log(res.data)
    setValues(res.data.task)
  }

  useEffect(()=>{
    fetchTask()
  },[])
  

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      Plan_startDate: values.Plan_startDate,
      Plan_endDate: values.Plan_endDate
    }

    const res = await axios.patch(`/api/v1/applications/${values.Plan_app_Acronym}/plans/${values.Plan_MVP_name}`, data)
    console.log(res.data)
    const alertMessage = 'updated plan'
    if (res.data) {
      displayAlert('success', alertMessage)
      setTimeout(()=>{
        clearAlert();
      }, 3000)
    }
  }

  const closePlan = async () => {
    const res = await axios.get(`/api/v1/applications/${values.Plan_app_Acronym}/plans/${values.Plan_MVP_name}/close`)
    console.log(res.data)
  }

  const { Task_name, Task_description, Task_state, Task_creator, Task_owner } = values
  return (
    <div className='p-4'>
      <div className='flex items-center'>
        <h2 className='font-bold text-2xl'>Task: {Task_name} <span className='badge badge-lg badge-info text-white'>{Task_state}</span></h2>
      </div>
      <div className='h-15'>
        {showAlert? <Alert /> : " "}
      </div>
      <div className='my-2 p-6 w-8/12 border rounded-md'>
        <p>Description: {Task_description}</p>
        <p>Creator: {Task_creator}</p>
        {Task_owner && <p>Owner: {Task_owner}</p>}
      </div>
      <button className='btn btn-primary '>Approve</button>
    </div>
  );
};

export default ShowTask;