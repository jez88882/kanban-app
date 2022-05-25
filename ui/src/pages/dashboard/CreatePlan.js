import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Alert } from '../../components'
import axios from 'axios'
import { useAppContext } from '../../context/appContext'
import { FormRow } from '../../components'

const CreatePlan = () => {
  const params = useParams()
  const initialState = {
    Plan_MVP_name: '',
    Plan_startDate: '',
    Plan_endDate: '',
    Plan_app_Acronym: params.app_Acronym,
  }
  
  const [values, setValues] = useState(initialState)
  const { displayAlert, showAlert, clearAlert } = useAppContext()

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.post(`/api/v1/applications/${values.Plan_app_Acronym}/plans`, values)

    const alertMessage = 'created plan'
    if (res.data) {
      displayAlert('success', alertMessage)
      setTimeout(()=>{
        clearAlert();
      }, 3000)
    }
  }

  return (
    <div className='p-4'>
      <h2 className='font-bold text-2xl'>Create Plan</h2>
      <div className='h-15'>
        {showAlert? <Alert /> : " "}
      </div>
      <form className='my-2 p-6 w-8/12 border rounded-md' onSubmit={handleSubmit}>
        <FormRow type='text' name='Plan_MVP_name' value={values.Plan_MVP_name} handleChange={handleChange} labelText='MVP name'/>
        <FormRow type='date' name='Plan_startDate' value={values.Plan_startDate} handleChange={handleChange} labelText='Start date'/>
        <FormRow type='date' name='Plan_endDate' value={values.Plan_endDate} handleChange={handleChange} labelText='End date'/>
        <button type="submit" className='btn btn-primary my-2 btn-block'>Create Plan</button>
      </form>
    </div>
  );
};

export default CreatePlan;