import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Alert } from './index'
import axios from 'axios'
import { useAppContext } from '../context/appContext'
import { FormRow } from './index'



const Plan = (props) => {
  const { Plan_MVP_name, Plan_startDate, Plan_endDate, closed } = props.plan
  const params = useParams()
  const permits = props.permits
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
    <>
      {/* Card */}
      <label for="my-modal-4" class="cursor-pointer">
         <div key={Plan_MVP_name} className={`border mb-2 px-3 py-1 flex items-center rounded ${closed ? "text-gray-500 bg-gray-200" : ""}`}>
            <p className="text-lg w-1/4">
              {Plan_MVP_name}
            </p>
            <p className="text-lg w-2/4 align-middle">{Plan_startDate} to {Plan_endDate}</p>
          </div>
      </label>

      {/* Modal */}
      <input type="checkbox" id="my-modal-4" class="modal-toggle" />
      <label for="my-modal-4" class="modal cursor-pointer">
        <label class="modal-box relative" for="">
        <div className='p-2'>
          <div className='flex items-center'>
            <h2 className='font-bold text-2xl'>Plan: {Plan_MVP_name}</h2>
            {permits.Open &&
              <button className='btn btn-info ml-2' onClick={closePlan} disabled={closed}>Close Plan</button>
            }
          </div>
          <div className='h-15'>
            {showAlert? <Alert /> : " "}
          </div>
          <form className='my-2 p-6 border rounded-md' onSubmit={handleSubmit}>
            <FormRow type='date' name='Plan_startDate' value={Plan_startDate} handleChange={handleChange} labelText='Start date' disabled={closed}/>
            <FormRow type='date' name='Plan_endDate' value={Plan_endDate} handleChange={handleChange} labelText='End date' disabled={closed}/>
            <button type="submit" className='btn btn-primary my-2 btn-block' disabled={closed}>Update Plan</button>
          </form>
        </div>
        </label>
      </label>
    </>
  );
};

export default Plan;