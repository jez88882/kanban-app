import { useAppContext } from "../../context/appContext";
import { Alert, FormRow } from "../../components";
import axios from 'axios'
import { useState } from "react";

const Account = () => {
  const { user, displayAlert, showAlert, clearAlert } = useAppContext()
  
  const initialState = {
    id: user.id,
    username: user.username,
    email: user.email,
    password: null,
  }

  const [values, setValues] = useState(initialState);
  const [formDisabled, setFormDisabled] = useState(true);

  const handleClick = async () => {
    try {
      const res = await axios.post('/api/v1/password/forgot', { email: user.email })
      console.log(res.data.message)
      displayAlert('success', res.data.message)
      
    } catch (error) {
      displayAlert('error', error.response.data.errMessage)
    }
  }

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const toggleForm = () => {
    setFormDisabled(!formDisabled)
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
      setFormDisabled(true)
      setTimeout(()=>{
        clearAlert();
      },10000)
      
    } catch (error) {
      console.log(error.response)
      
    }
  }

  const checkGroup = async () => {
    const response = await axios.get(`api/v1/users/${user.id}/checkGroup`)
    console.log(response.data)
  }
  return (
    <div>
      <h1>My account</h1>
      <button class="btn btn-primary" onClick={checkGroup}>Check Group</button>
      <button onClick={toggleForm} class="btn">Edit</button>
      <form onSubmit={handleSubmit} disabled={formDisabled}>
        <FormRow type="text" name="username" labelText="Username" value={values.username} handleChange={handleChange} disabled={formDisabled}/>
        <FormRow type="email" name="email" labelText="Email" value={values.email} handleChange={handleChange} disabled={formDisabled}/>
        <FormRow type="password" name="password" labelText="Password" value={values.password} handleChange={handleChange} disabled={formDisabled}/>
        <button disabled={formDisabled} className='btn btn-primary'>Update</button>
      </form>
      <button onClick={handleClick}>reset password</button>
      {showAlert && <Alert />}
    </div>
  );
};

export default Account;