import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAppContext } from '../context/appContext'
import { FormRow, Alert } from '.'

const OpenTask = (props) => {
  const { Task_id, Task_name, Task_creator, Task_createDate, Task_description, Task_state, Task_plan } = props.task
  const moveTask = props.moveTask
  const app_Acronym = props.app_Acronym
  const { displayAlert, showAlert, clearAlert, user } = useAppContext()
  const [disabled, setDisabled] = useState(true)

  const is_creator = user.username === Task_creator

  const initialState = {
    Task_description,
    Task_plan,
  }

  const [values, setValues] = useState(initialState)

  useEffect(()=>{
  },[])
  
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    toggle()
    
    const res = await axios.patch(`/api/v1/applications/${app_Acronym}/tasks/${Task_id}`, values)
    if (res.data) {
      displayAlert('success', "updated task")
      setTimeout(()=>{
        clearAlert();
      }, 1000)
    }
  }
    
  const toggle = () => {
    setDisabled(!disabled)
  }
    
  const approve = async () => {
    const res = await axios.get(`/api/v1/applications/${app_Acronym}/tasks/${Task_id}/approve`)
    console.log(res.data)
    moveTask(res.data.task, "open", "toDo")
    if (res.data) {
      displayAlert('success', "approved task")
      setTimeout(()=>{
        clearAlert();
      }, 3000)
    }
  }

  return (
    <>
    {/** Card **/}
      <label for={Task_name} className='cursor-pointer'>
        <div className={`border mb-2 px-3 py-1 flex rounded items-center`}>
          <div className="w-1/4">
            <p className="text-lg">{Task_name}</p>
          </div>
          <div className="w-1/4">
            <p className="text-lg text-slate-500">{is_creator? "you" : Task_creator}</p>
          </div>
          <p className="w-1/4">{Task_createDate}</p>
          <button className="btn btn-info w-1/4" onClick={approve}>Approve</button>
        </div>
      </label>
      {/** Modal **/}
      <input type="checkbox" id={Task_name} className="modal-toggle" />
      <label for={Task_name} className="modal cursor-pointer">
        <label className="modal-box relative" for="">
          <div className='flex justify-between'>
            <div>
              <h2 className='font-bold text-xl'>Task: {Task_name}</h2>
              <p className='text-sm ml-1 text-gray-400'>Created by <span className='font-bold'>{is_creator? "you" : Task_creator}</span></p>
            </div>
            <div>
              <button type="button" className={`btn btn-sm ${disabled ? "btn-outline btn-primary" : "btn-ghost text-gray-500"}`}onClick={toggle}>Edit task</button>
            </div>
          </div>
          {showAlert && <Alert />}
          <form className='form-control' onSubmit={handleSubmit}>
            <FormRow type="text" name="Task_plan" labelText="Task plan" value={values.Task_plan} handleChange={handleChange} disabled={disabled}/>
            <label htmlFor='Task_description' className='label label-text w-full max-w-xs'>Task description</label>
            <textarea id="Task_description" name="Task_description" className='textarea textarea-bordered textarea-primary w-full' rows="7" cols="33" value={values.Task_description} onChange={handleChange} disabled={disabled}></textarea>
            {!disabled && <button type="submit" className='btn btn-primary my-2 btn-block'>Update Task</button>}
          </form>
         
        </label>
      </label>
    </>
  );
};

export default OpenTask;