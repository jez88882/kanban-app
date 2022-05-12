import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppContext } from '../../context/appContext'
import { Modal, FormRow, Alert } from '../../components'

const initialApp =  { 
  app_Acronym:'', 
  app_Description: '',
  UserGroups: [],
  userGroup:'',
  username: '',
}

const initialState = {
  app_Acronym: '',
  appList: [],
  application: initialApp,
  usersList:[]
}

const AssignGroups = () => {
  const [values, setValues] = useState(initialState)
  
  const { showAlert, fetchUsers, displayAlert, clearAlert } = useAppContext()

  const fetchChosenApp = async (app_Acronym) => {
    const res = await axios.get(`/api/v1/applications/${app_Acronym}`)
    console.log('fetching data')
    console.log(res.data.data)
    if (res.data.data !== null) {
      setValues({...values, application: res.data.data})
    }
  }
  
  const fetchApps = async () => {
    console.log('fetching apps')
    const res = await axios.get('/api/v1/applications')
    setValues({...values, appList: res.data.apps})
  }

  useEffect(()=>{
    fetchApps();
    fetchUsers().then(users => setValues({...values, usersList: users}));
  },[])


  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
    if ( e.target.name==='app_Acronym' && e.target.value !== "" ){
      fetchChosenApp(e.target.value)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  }
  
  const createUserGroup = async(e) =>{
    e.preventDefault()
    const data = {
      name: values.userGroup,
      app_Acronym: values.app_Acronym,
      username: values.username
    }
    const res = await axios.post(`/api/v1/groups`, data)
    displayAlert('success', `created user group ${values.userGroup}`)
    setTimeout(()=>{
      clearAlert()
    }, 3000)
  }

  const appList = values.appList.map((app) => <option key={app} value={app}/>)

  const usersList = values.usersList.map((user) => 
  <option key={user.id} value={user.username}>{user.username}</option>
  )
 
 
  const { app_Acronym, app_Description, UserGroups } = values.application
 
  const userGroupsList = UserGroups.map((group)=>
        <tr className="hover">
          <td>{group.user_id}</td>
          <td>{group.name}</td>
        </tr>
  )

  return (
    <div className='p-4'>
      <h2 className='font-bold text-2xl'>Assign Groups</h2>
      <div className='mt-2'>
        {showAlert && <Alert />}
      </div>
      <form className='my-2 p-6 w-9/12 border rounded-md' onSubmit={handleSubmit}>
        <label htmlFor="app_Acronym">Choose an app: </label>
        <input list="appList" id="app_Acronym" name="app_Acronym" onChange={handleChange}/>
        <datalist id="appList">
          {appList}
        </datalist>
      </form>
      <div className='my-2 p-6 border rounded-md w-9/12'>
        <form className='form-control' onSubmit={createUserGroup} >
          <label for="usergroup-select" className='label label-text max-w-xs'>UserGroup</label>
          <select className='input input-bordered input-primary' name="userGroup" id="usergroup-select" onChange={handleChange}>
            <option value="">--Please choose an option--</option>
            <option value="project manager">project manager</option>
            <option value="project lead">project lead</option>
            <option value="team member">team member</option>
          </select>
          <label className='label label-text max-w-xs' for="user-select">User: </label>
          <select className='input input-bordered input-primary' name="user" id="user-select" onChange={handleChange}>
            <option value="">--Please choose an option--</option>
            {usersList}
          </select>
          <button type="submit" className='btn btn-primary mt-2'>Assign to {values.app_Acronym}</button>
        </form>
      </div>
      <div className=' my-2 p-6 w-9/12 border rounded-md'>
        <h2 className='font-bold text-lg'>Application: {app_Acronym ? app_Acronym : "please choose an app"}</h2>
        <p>{app_Description || ""}</p>

        <div class="overflow-x-auto">
          <table class="table w-full">
            {/* <!-- head --> */}
            <thead>
              <tr>
                <th>User</th>
                <th>Group</th>
              </tr>
            </thead>
            <tbody>
              {userGroupsList}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssignGroups;