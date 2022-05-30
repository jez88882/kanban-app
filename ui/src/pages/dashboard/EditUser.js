import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppContext } from '../../context/appContext'
import { Modal, FormRow, Alert } from '../../components'

const initialValues = {
 email:'',
 password: '',
 is_disabled: false
}

const initialState = {
  alluserGroups: [],
  thisUserGroups: []
}

const EditUser = () => {
  const params = useParams();
  const [values, setValues] = useState(initialValues)
  const [state, setState] = useState(initialState)
  const [newUserGroup, setNewUserGroup] = useState('')

  const {disableUser, displayAlert, clearAlert } = useAppContext()

  const fetchUser = async () => {
    const res = await axios.get(`/api/v1/users/${params.username}`)
    const { email, is_disabled } = res.data.data
    setValues({ ...values, email, is_disabled })
  }

  const fetchUserGroups = async() => {
    const groups = await axios.get('/api/v1/groups')
    const thisusergroups = await axios.get(`/api/v1/groups?user=${params.username}`)
    setState({...state, thisUserGroups: thisusergroups.data.groups, alluserGroups: groups.data.groups})
  }
  

  useEffect(()=>{
    fetchUser();
    fetchUserGroups()
  },[])

  const handleChange = (e) => {
    setValues({...values, [e.target.name]: e.target.value })
  }

  const handleChangeUserGroups = (e) => {
    setNewUserGroup(e.target.value)
  }

  const handleClick = async (e) => {
    console.log(values)

    try {
      const res = await axios.patch(`/api/v1/users/${params.username}`, values)
      displayAlert('success', res.data.message)
    } catch (error) {
      displayAlert('error', error.response.data.errMessage)
    }
    setTimeout(()=>{
      clearAlert();
    },10000)

  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
  }
  
  const handleDisable = () => {
    setValues({...values, is_disabled: true},)
    disableUser(params.username)
  }

  const createUserGroup = async(e) =>{
    e.preventDefault()

    const data = {
      group: newUserGroup,
      username: params.username
    }

    if (newUserGroup==='') {
      displayAlert('error', 'please enter a usergroup')
      return
    }

    try {
      const res = await axios.post(`/api/v1/groups`, data)
      const updatedGroups = state.thisUserGroups.concat(res.data.usergroup)
      setState({...state, thisUserGroups: updatedGroups})
      setNewUserGroup('')
      displayAlert('success', "Added user group")
    } catch (error) {
      console.log(error.response)
      displayAlert('error', error.response.data.errMessage)
    }
    setTimeout(()=>{
      clearAlert()
    }, 2000)
  }
  
  const userGroupsList = state.alluserGroups.map((usergroup) => 
  <option key={usergroup.id} value={usergroup.group}/>
  )

  return (
    <div className='p-4'>
      
      <h2 className={`font-bold text-2xl ${values.is_disabled ? "text-slate-400": ""}`}>Edit User: {params.username}</h2>

      <div className='grid grid-cols-2 gap-4 w-full xs:w-6/12'>
        <div className="p-6 border rounded-md flex flex-col min-w-80"> 
          <div className="flex justify-between">
            <form onSubmit={handleSubmit} className='flex justify-between items-end'>
              <FormRow type="email" name="email" value={values.email} labelText="Update Email" handleChange={handleChange}/>
              <button type="button" onClick={handleClick} className="btn btn-primary mt-4 mx-2 ">Update Email</button>
            </form>
          </div>
          <div className="divider divider-vertical"></div> 
          <div className="flex justify-between">
            <form onSubmit={handleSubmit} className='flex justify-between items-end'>
              <FormRow type="password" name="password" value={values.password} labelText="Reset Password" handleChange={handleChange}/>
              <button type="button" onClick={handleClick} className="btn btn-primary mt-4 mx-2 ">Reset Password</button>
            </form>
          </div>
          <div className="divider divider-vertical"></div> 
            <button type="button" onClick={handleDisable} className="btn bg-blue-300 text-blue-500	hover:bg-primary hover:text-white" disabled={values.is_disabled}>Disable user</button>
        </div>
        <div className='p-6 border rounded-md'>
          <p className='text-lg font-bold'>Usergroups</p>
          {state.thisUserGroups.map(usergroup=> 
            <div key={usergroup.id} className='border rounded-md my-2 p-2 bg-white shadow-sm'>{usergroup.group}</div>
          )}
          <form className='form-control' onSubmit={createUserGroup} >
            <label htmlFor="usergroup-select" className='label label-text max-w-xs'>UserGroup:</label>
            <p className='text-sm text-red-500'>please use format: 'AppAcronym_Group' e.g. 'API_project manager'</p>
            <input type="text" list="usergroupslist" className='input input-bordered input-primary' name="userGroup" id="usergroup-input" onChange={handleChangeUserGroups} value={newUserGroup}/>
            <datalist id="usergroupslist">
              {userGroupsList}
            </datalist>
            <button type="submit" className='btn btn-primary mt-2'>Assign</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;