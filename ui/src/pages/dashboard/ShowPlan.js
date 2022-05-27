import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Alert } from '../../components'
import axios from 'axios'
import { useAppContext } from '../../context/appContext'
import { FormRow } from '../../components'


const ShowPlan = () => {
  const params = useParams()
  const { displayAlert, showAlert, clearAlert } = useAppContext()
  
  const initialState = {
    Plan_MVP_name: params.MVP_name,
    Plan_startDate: '',
    Plan_endDate: '',
    Plan_app_Acronym: params.app_Acronym,
    closed: null
  }
  
  const [values, setValues] = useState(initialState)
  
  const fetchPlan = async () => {
    const res = await axios.get(`/api/v1/applications/${params.app_Acronym}/plans/${params.MVP_name}`)
    setValues({
      ...values,
      Plan_startDate: res.data.plan.Plan_startDate,
      Plan_endDate: res.data.plan.Plan_endDate,
      closed: res.data.plan.closed
    })
  }

  useEffect(()=>{
    fetchPlan()
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

  return (
    <div className='p-4'>
      <div className='flex items-center'>
        <h2 className='font-bold text-2xl'>Plan {values.Plan_MVP_name}</h2>
        <button className='btn btn-info ml-2' onClick={closePlan} disabled={values.closed}>Close Plan</button>
      </div>
     
      <form className='my-2 p-6 w-8/12 border rounded-md' onSubmit={handleSubmit}>
        <FormRow type='date' name='Plan_startDate' value={values.Plan_startDate} handleChange={handleChange} labelText='Start date' disabled={values.closed}/>
        <FormRow type='date' name='Plan_endDate' value={values.Plan_endDate} handleChange={handleChange} labelText='End date' disabled={values.closed}/>
        <button type="submit" className='btn btn-primary my-2 btn-block' disabled={values.closed}>Update Plan</button>
      </form>
    </div>
  );
};

export default ShowPlan;