import axios from 'axios'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppContext } from '../../context/appContext'
import { Modal, FormRow, Alert } from '../../components'

const initialValues = {
  userGroup: '',
  username: '',
}

const initialState = {
  usersList: [],
  userGroupsList: [],
}

const AssignGroups = () => {
  const [values, setValues] = useState(initialValues)
  const [state, setState] = useState(initialState)
  
  const { showAlert, fetchUsers, displayAlert, clearAlert } = useAppContext()
  
  const fetchData = async () => {
    console.log('fetching usergroups')
    const groups = await axios.get('/api/v1/groups')
    const users = await fetchUsers()
    setState({...state, 
      userGroupsList: groups.data.groups,
      usersList: users
    })
  }

  useEffect(()=>{
    fetchData()
  },[])


  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(values.)

    if ([values.userGroup, values.username].includes('')) {
      displayAlert('error', 'please fill in all values')
      return
    }
    const data = {
      group: values.userGroup,
      username: values.username
    }
    console.log(data)
    const res = await axios.post(`/api/v1/groups`, data)
    displayAlert('success', `created user group ${values.userGroup}`)
    setTimeout(()=>{
      clearAlert()
    }, 3000)
  }

  // const appList = values.appList.map((app) => <option key={app} value={app}/>)

  const usersList = state.usersList.map((user) => 
  <option key={user.username} value={user.username}>{user.username}</option>
  )
  const userGroupsList = state.userGroupsList.map((usergroup) => 
  <option key={usergroup.id} value={usergroup.group}/>
  )

  return (
    <div className='p-4'>
      <h2 className='font-bold text-2xl'>Assign Groups</h2>
      <div className='mt-2'>
        {showAlert && <Alert />}
      </div>
      <div className='my-2 p-6 border rounded-md w-6/12'>
        <form className='form-control' onSubmit={handleSubmit} >
          <label htmlFor="usergroup-select" className='label label-text max-w-xs'>UserGroup:</label>
          <p className='text-sm text-red-500'>please use format: 'AppAcronym_Group' e.g. 'API_project manager'</p>
          <input type="text" list="usergroupslist" className='input input-bordered input-primary' name="userGroup" id="usergroup-input" onChange={handleChange} />
          <datalist id="usergroupslist">
            {userGroupsList}
          </datalist>
          <label className='label label-text max-w-xs' for="user-select">User: </label>
          <select className='input input-bordered input-primary' name="username" id="user-select" onChange={handleChange}>
            <option value="">--Please choose an option--</option>
            {usersList}
          </select>
          <button type="submit" className='btn btn-primary mt-2'>Assign</button>
        </form>
      </div>
    </div>
  );
};

export default AssignGroups;