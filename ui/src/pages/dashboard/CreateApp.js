import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Alert } from '../../components'
import axios from 'axios'
import { useAppContext } from '../../context/appContext'
import { FormRow } from '../../components'

const initialState = {
  App_Acronym: '',
  App_Description: '',
  startDate: '',
  endDate: '',
  App_permit_Open: '',
  App_permit_Doing: '',
  App_permit_toDo: '',
  App_permit_Done: '',
}


const Permit = (props) => {
  return(
    <div>
      <label for="usergroup-select" className='label label-text max-w-xs'>{props.label}</label>
      <select className='input input-bordered input-primary w-full' name={`App_permit_${props.permit}`} id="usergroup-select" onChange={props.handleChange} value={props.value}>
        <option value="">--Please choose an option--</option>
        <option value="project manager">project manager</option>
        <option value="admin">admin</option>
        <option value="project lead">project lead</option>
        <option value="team member">team member</option>
      </select>
    </div>
  );
}

const CreateApp = () => {
  const [values, setValues] = useState(initialState)
  const { displayAlert, showAlert, clearAlert } = useAppContext()
  const params = useParams()
  
  const fetchApp = async (app_Acronym) => {
    const res = await axios.get(`/api/v1/applications/${app_Acronym}`)
    console.log(res)
    setValues(res.data.app)
  }

  useEffect(()=>{
    if ( params.app_Acronym ) {
      fetchApp(params.app_Acronym)
    }
  },[params.app_Acronym])

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    let res

    if (params.app_Acronym) {
      res = await axios.patch(`/api/v1/applications/${params.app_Acronym}`, values)
    } else {
      res = await axios.post('/api/v1/applications', values)
    }
    console.log(res.data)
    const alertMessage = params.app_Acronym ? `updated ${params.app_Acronym}` : 'created app'
    if (res.data) {
      displayAlert('success', alertMessage)
      setTimeout(()=>{
        clearAlert();
      }, 3000)
    }
  }

  // const appList = values.apps.map((app) => <option key={app} value={app}/>)

  return (
    <div className='p-4'>
      <h2 className='font-bold text-2xl'>{params.app_Acronym ? `Edit ${params.app_Acronym}` : 'Create App'}</h2>
      <div className='h-15'>
        {showAlert? <Alert /> : " "}
      </div>
      <form className='my-2 p-6 w-4/12 border rounded-md' onSubmit={handleSubmit}>
        <div>
          <label  className='label label-text w-full max-w-xs' htmlFor="App_Acronym">App Acronym: </label>
          <input className='input input-bordered input-primary w-full' list="appList" id="App_Acronym" name="App_Acronym" onChange={handleChange} value={values.App_Acronym} disabled={params.app_Acronym}/>
        </div>
        <datalist id="appList">
          {/* {appList} */}
        </datalist>
        <label htmlFor='App_Description' className='label label-text w-full max-w-xs'>App description</label>
        <textarea id="App_Description" name="App_Description" className='textarea textarea-bordered textarea-primary w-full' rows="7" cols="33" value={values.App_Description} onChange={handleChange} ></textarea>
        <FormRow type="date" name="startDate" labelText="Start date" value={values.startDate} handleChange={handleChange} />
        <FormRow type="date" name="endDate" labelText="End date" value={values.endDate} handleChange={handleChange} />
        <Permit permit="Open" label="Permit Open" handleChange={handleChange} value={values.App_permit_Open}/>
        <Permit permit="toDo" label="Permit To Do" handleChange={handleChange} value={values.App_permit_toDoList}/>
        <Permit permit="Doing" label="Permit Doing" handleChange={handleChange} value={values.App_permit_Doing}/>
        <Permit permit="Done" label="Permit Done" handleChange={handleChange} value={values.App_permit_Done}/>
        <button type="submit" className='btn btn-primary my-2 btn-block'>{params.app_Acronym ? "Update" : "Create"}</button>
      </form>
    </div>
  );
};

export default CreateApp;