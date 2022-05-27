import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Alert } from './index'
import axios from 'axios'
import { useAppContext } from '../context/appContext'
import { FormRow } from './index'

const Plan = (props) => {
  const { Plan_MVP_name, Plan_startDate, Plan_endDate, closed, Plan_app_Acronym, Plan_description } = props.plan
  const permits = props.permits
  const { displayAlert, showAlert, clearAlert } = useAppContext()
  
  const initialState = {
    Plan_startDate,
    Plan_endDate,
    Plan_description,
  }
  
  const [values, setValues] = useState(initialState)
  
  useEffect(()=>{
  },[])

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      Plan_startDate: values.Plan_startDate,
      Plan_endDate: values.Plan_endDate,
      Plan_description: values.Plan_description
    }

    const res = await axios.patch(`/api/v1/applications/${Plan_app_Acronym}/plans/${Plan_MVP_name}`, data)
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
      <label htmlFor={Plan_MVP_name} className="cursor-pointer">
         <div key={Plan_MVP_name} className={`border mb-2 px-3 py-1 flex items-center rounded ${closed ? "text-gray-500 bg-gray-200" : ""}`}>
            <p className="text-lg w-1/4">
              {Plan_MVP_name}
            </p>
            <p className="text-lg w-2/4 align-middle">{Plan_startDate} to {Plan_endDate}</p>
          </div>
      </label>

      {/* Modal */}
      <input type="checkbox" id={Plan_MVP_name} className="modal-toggle" />
      <label htmlFor={Plan_MVP_name} className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
        <div className='p-2'>
          <div className='flex items-center'>
            <h2 className='font-bold text-2xl'>Plan: {Plan_MVP_name}</h2>
            {permits.Open &&
              <button className='btn btn-info ml-2' onClick={closePlan} disabled={closed}>Close Plan</button>
            }
          </div>
         
          <form className='my-2 p-6 border rounded-md' onSubmit={handleSubmit}>
            <label htmlFor='Plan_description' className='label label-text w-full max-w-xs' >Description</label>
            <textarea id="Plan_description" name="Plan_description" className='textarea textarea-bordered textarea-primary w-full' rows="7" cols="33" value={values.Plan_description} onChange={handleChange}  disabled={!permits.Open}></textarea>
            <FormRow type='date' name='Plan_startDate' value={values.Plan_startDate} handleChange={handleChange} labelText='Start date' disabled={closed || !permits.Open}/>
            <FormRow type='date' name='Plan_endDate' value={values.Plan_endDate} handleChange={handleChange} labelText='End date' disabled={closed || !permits.Open}/>
            {permits.Open && 
              <button type="submit" className='btn btn-primary my-2 btn-block' disabled={closed}>Update Plan</button>
            }
          </form>
        </div>
        </label>
      </label>
    </>
  );
};

export default Plan;