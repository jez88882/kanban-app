import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppContext } from '../../context/appContext'
import { Modal, FormRow, Alert } from '../../components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'


const initialState = {
  username: '',
  email: '',
  is_disabled: null,
  password: null,
  userGroup:'',
}

const EditUser = () => {
  const params = useParams();
  const [values, setValues] = useState(initialState)

  const {disableUser, showAlert, displayAlert, clearAlert } = useAppContext()

  const fetchUser = async () => {
    const res = await axios.get(`/api/v1/users/${params.username}`)
    const { id, username, email, is_disabled } = res.data.data
    setValues({ id, username, email, is_disabled })
  }
  
  useEffect(()=>{
    fetchUser();
  },[])

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleClick = async (e) => {
    const data = {
      id: values.id,
      email: values.email,
      password: values.password
    }
    try {
      const res = await axios.patch(`/api/v1/users/${values.username}`, data)
      displayAlert('success', res.data.message)
      setTimeout(()=>{
        clearAlert();
      },10000)
    } catch (error) {
      console.log(error.response)
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
  }
  
  const handleDisable = () => {
    setValues({...values, is_disabled: true},)
    disableUser(values.id)
  }

  const createUserGroup = async(e) =>{
    e.preventDefault()
    const data = {
      name: values.userGroup,
      username: values.username
    }
    const res = await axios.post(`/api/v1/users/${values.id}/groups`, data)
    console.log(res.data)
    displayAlert('success', "Added user group")
    setTimeout(()=>{
      clearAlert()
    }, 2000)
  }

  return (
    <div className='p-4'>
      <h2 className={`font-bold text-2xl ${values.is_disabled ? "text-slate-400": ""}`}>Edit User: {values.username}</h2>
      <div className='mt-2 '>
        {showAlert && <Alert />}
      </div>
      <div className='flex'>
        <div className="m-6 p-6 w-3/12 border rounded-md flex flex-col items-center"> 
          <div className="flex justify-between w-full">
            <form onSubmit={handleSubmit} className='flex justify-between items-end'>
              <FormRow type="email" name="email" value={values.email} labelText="Update Email" handleChange={handleChange}/>
              <button type="button" onClick={handleClick} className="btn btn-primary mt-4 mx-2 ">Update Email</button>
            </form>
          </div>
          <div className="divider divider-vertical"></div> 
          <div className="flex justify-between w-full">
            <form onSubmit={handleSubmit} className='flex justify-between items-end'>
              <FormRow type="password" name="password" value={values.password} labelText="Reset Password" handleChange={handleChange}/>
              <button type="button" onClick={handleClick} className="btn btn-primary mt-4 mx-2 ">Reset Password</button>
            </form>
          </div>
          <div className="divider divider-vertical"></div> 
            <button type="button" onClick={handleDisable} className="btn bg-blue-300 text-blue-500	hover:bg-primary hover:text-white w-8/12" disabled={values.is_disabled}>Disable user</button>
        </div>
      </div>
    </div>
  );
};

export default EditUser;