import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Alert } from '.'
import axios from 'axios'
import { useAppContext } from '../context/appContext'
import { FormRow } from '.'



const CreateTask = (props) => {
  const { displayAlert, showAlert, clearAlert, user } = useAppContext()
  const {plans, addOpenTask } = props
  
  

  const initialState = {
    Task_name: '',
    Task_description: '',
    Task_plan: '',
    Task_creator: user.username,
    Task_note: ''
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
    setValues(initialState)
    addOpenTask(res.data.task)
    const alertMessage = 'created task'
    if (res.data) {
      displayAlert('success', alertMessage)
      setTimeout(()=>{
        clearAlert();
      }, 3000)
    }
  }

  const plansList = plans.map((plan) => 
  <option key={plan.Plan_MVP_name} value={plan.Plan_MVP_name}>{plan.Plan_MVP_name}</option>
  )

  return (
    <>
      {/* Button */}
      <label for="create-task" className="btn btn-outline btn-primary w-full">
        Create new task
      </label>

      {/* Modal */}
      <input type="checkbox" id="create-task" class="modal-toggle" />
      <label for="create-task" class="modal cursor-pointer">
        <label class="modal-box relative" for="">
          <h2 className='font-bold text-2xl'>Create Task</h2>
          
          <form className='my-2 p-6 w-full border rounded-md' onSubmit={handleSubmit}>
            <FormRow type="text" name="Task_name" labelText="Task name" value={values.Task_name} handleChange={handleChange} />
            <label className='label label-text' for="Task plan">Task plan </label>
            <select className='input input-bordered input-primary w-full' name="Task_plan" id="Task plan" onChange={handleChange}>
              <option value=""></option>
              {plansList}
            </select>
            <label htmlFor='Task_description' className='label label-text w-full max-w-xs'>Task description</label>
            <textarea id="Task_description" name="Task_description" className='textarea textarea-bordered textarea-primary w-full' rows="7" cols="33" value={values.Task_description} onChange={handleChange} ></textarea>
            <FormRow type="text" name="Task_note" labelText="Task note" value={values.Task_note} handleChange={handleChange} />
            <button type="submit" className='btn btn-primary my-2 btn-block'>Create Task</button>
          </form>
        </label>
      </label>
    </>
  );
};

export default CreateTask;