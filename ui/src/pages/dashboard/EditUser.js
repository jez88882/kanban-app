import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppContext } from '../../context/appContext'
import { Modal, FormRow, Alert } from '../../components'

const initialState = {
  id: '',
  username: '',
  email: '',
  is_disabled: null,
  password: null,
}

const EditUser = () => {
  const params = useParams();
  const [values, setValues] = useState(initialState)

  const { isLoading, disableUser, showAlert, displayAlert, clearAlert } = useAppContext()

  const fetchUser = async () => {
    const res = await axios.get(`/api/v1/users/${params.id}`)
    const { id, username, email, is_disabled } = res.data.data
    setValues({ id, username, email, is_disabled })
    console.log(res.data.data)
  }
  
  useEffect(()=>{
    fetchUser();
  },[])

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      id: values.id,
      username: values.username,
      email: values.email,
      password: values.password
    }
    try {
      const res = await axios.put(`/api/v1/users/${values.id}`, data)
      console.log(res.data)
      displayAlert('success', res.data.message)
      setTimeout(()=>{
        clearAlert();
      },10000)
      
    } catch (error) {
      console.log(error.response)
      
    }
  }
  
  const handleDisable = () => {
    disableUser(values.id)
  }
 
  return (
    <div>
      <h1>Edit User</h1>
      {showAlert && <Alert />}
      <form onSubmit={handleSubmit}>
        <FormRow type="text" name="username" value={values.username} labelText="Username" handleChange={handleChange}/>
        <FormRow type="text" name="email" value={values.email} labelText="Email" handleChange={handleChange}/>
        <FormRow type="password" name="password" value={values.password} labelText="Password" handleChange={handleChange}/>
        <button type="submit" className="btn btn-block mt-2" disabled={isLoading}>Update</button>
      </form>
      <button className='btn btn-block mt-2' disabled={values.is_disabled} onClick={handleDisable}>Disable User</button>
    </div>
  );
};

export default EditUser;