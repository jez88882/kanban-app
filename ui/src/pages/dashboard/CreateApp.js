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
  App_permit_Create: '',
  App_permit_Open: '',
  App_permit_Doing: '',
  App_permit_toDoList: '',
  App_permit_Done: '',
}


  const Permit = (props) => {
    
    return(
      <div>
        <label for="usergroup-select" className='label label-text max-w-xs'>{props.label}</label>
        <select className='input input-bordered input-primary w-full' name={`App_permit_${props.permit}`} id="usergroup-select" onChange={props.handleChange} value={props.value} disabled={props.disabled}>
          {props.userGroups.map(group=> <option key={group.group} value={group.group}>{group.group}</option>)}
          
        </select>
      </div>
    );
  }

  
  
  const CreateApp = () => {
    const [values, setValues] = useState(initialState)
    const { displayAlert, clearAlert } = useAppContext()
    const params = useParams()
    const [userGroups, setUserGroups] = useState([])
    const [isPM, setIsPM] = useState(false)
    
    const checkPM = async() => {
      try {
        const resPM= await axios.get('/api/v1/groups/checkGeneralPM')
        setIsPM(resPM.data.result)
      } catch (error) {
        console.log(error)
      }
    }
  const fetchData = async () => {
    console.log('fetching usergroups')
    const res = await axios.get('/api/v1/groups')
    setUserGroups(res.data.groups)
  }
  const fetchApp = async (app_Acronym) => {
    const res = await axios.get(`/api/v1/applications/${app_Acronym}`)
    console.log(`fetched App: ${app_Acronym}`)
    setValues(res.data.app)
  }
  
  useEffect(()=>{
    if ( params.app_Acronym ) {
      fetchApp(params.app_Acronym)
    }
    fetchData()
    checkPM()
  },[params.app_Acronym])
  
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formIsNotCompletelyFilled = [values.App_Acronym, values.App_Description, values.startDate, values.endDate, values.App_permit_Create, values.App_permit_Open, values.App_permit_toDoList, values.App_permit_Doing, values.App_permit_Done].includes("")
    
    if (formIsNotCompletelyFilled) {
      displayAlert('error', 'please fill up all fields')
      setTimeout(()=>{
        clearAlert();
      }, 3000)
      
      return
    }
    
    let res
    
    try {
      if (params.app_Acronym) {
        res = await axios.patch(`/api/v1/applications/${params.app_Acronym}`, values)
      } else {
        res = await axios.post('/api/v1/applications', values)
      }
  
      const alertMessage = params.app_Acronym ? `updated ${params.app_Acronym}` : 'created app'
      displayAlert('success', alertMessage)
    } catch (error) {
      console.log(error.response)
      displayAlert('error', error.response.data.errMessage)
      
    }
    setTimeout(()=>{
      clearAlert();
    }, 3000)
  }

  // const appList = values.apps.map((app) => <option key={app} value={app}/>)

  return (
    <div className='p-6'>
      <h2 className='font-bold text-2xl'>{params.app_Acronym ? `Edit ${params.app_Acronym}` : 'Create App'}</h2>
      
      <form className='my-2 p-6 w-7/12 border rounded-md' onSubmit={handleSubmit}>
        <div>
          <label  className='label label-text w-full max-w-xs' htmlFor="App_Acronym">App Acronym: </label>
          <input className='input input-bordered input-primary w-full' list="appList" id="App_Acronym" name="App_Acronym" onChange={handleChange} value={values.App_Acronym} disabled={params.app_Acronym}/>
        </div>
        <datalist id="appList">
          {/* {appList} */}
        </datalist>
        <label htmlFor='App_Description' className='label label-text w-full max-w-xs'>App description</label>
        <textarea id="App_Description" name="App_Description" className='textarea textarea-bordered textarea-primary w-full' rows="7" cols="33" value={values.App_Description} onChange={handleChange} disabled={!isPM}></textarea>
        <div className='grid grid-cols-2 gap-2'>
          <FormRow type="date" name="startDate" labelText="Start date" value={values.startDate} handleChange={handleChange} disabled={!isPM}/>
          <FormRow type="date" name="endDate" labelText="End date" value={values.endDate} handleChange={handleChange} disabled={!isPM}/>
        </div>
        <div className='grid grid-cols-5 gap-3'>

        <Permit userGroups={userGroups} permit="Create" label="Permit Create" handleChange={handleChange} value={values.App_permit_Create} disabled={!isPM}/>
        <Permit userGroups={userGroups} permit="Open" label="Permit Open" handleChange={handleChange} value={values.App_permit_Open} disabled={!isPM}/>
        <Permit userGroups={userGroups} permit="toDoList" label="Permit To Do" handleChange={handleChange} value={values.App_permit_toDoList} disabled={!isPM}/>
        <Permit userGroups={userGroups} permit="Doing" label="Permit Doing" handleChange={handleChange} value={values.App_permit_Doing} disabled={!isPM}/>
        <Permit userGroups={userGroups} permit="Done" label="Permit Done" handleChange={handleChange} value={values.App_permit_Done} disabled={!isPM}/>
        </div>
        <button type="submit" className='btn btn-primary my-2 btn-block' disabled={!isPM}>{params.app_Acronym ? "Update" : "Create"}</button>
      </form>
    </div>
  );
};

export default CreateApp;