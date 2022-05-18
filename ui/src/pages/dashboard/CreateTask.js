import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Alert } from '../../components'
import axios from 'axios'
import { useAppContext } from '../../context/appContext'
import { FormRow } from '../../components'



const CreateTask = () => {
  const { displayAlert, showAlert, clearAlert, user } = useAppContext()

  const initialState = {
    Task_name: '',
    Task_description: '',
    Task_plan: '',
    Task_creator: user.username,
  }
  const [values, setValues] = useState(initialState)
  const params = useParams()

  useEffect(()=>{
 
  },[])

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
  e.preventDefault();

    const res = await axios.post(`/api/v1/applications/${params.app_Acronym}/tasks`, values)
    

    console.log(res.data)
    const alertMessage = 'created task'
    if (res.data) {
      displayAlert('success', alertMessage)
      setTimeout(()=>{
        clearAlert();
      }, 3000)
    }
  }

  return (
    <div className='p-6'>
      <h2 className='font-bold text-2xl'>Create Task</h2>
      <div className='h-15'>
        {showAlert? <Alert /> : " "}
      </div>
      <form className='my-2 p-6 w-full border rounded-md' onSubmit={handleSubmit}>
        <FormRow type="text" name="Task_name" labelText="Task name" value={values.Task_name} handleChange={handleChange} />
        <FormRow type="text" name="Task_plan" labelText="Task plan" value={values.Task_plan} handleChange={handleChange} />
        <label htmlFor='Task_description' className='label label-text w-full max-w-xs'>Task description</label>
        <textarea id="Task_description" name="Task_description" className='textarea textarea-bordered textarea-primary w-full' rows="7" cols="33" value={values.Task_description} onChange={handleChange} ></textarea>
        <button type="submit" className='btn btn-primary my-2 btn-block'>Create Task</button>
      </form>
    </div>
  );
};

export default CreateTask;