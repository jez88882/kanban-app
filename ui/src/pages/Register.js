import { useState, useEFfect } from 'react';
import { Axios } from 'axios';
import { FormRow, Alert } from '../components'
import { useAppContext } from '../context/appContext';

const initialState = {
  username: '',
  email: '',
  password: '',
  isMember: false
}
export default function Register() {
  const [values, setValues] = useState(initialState)

  // global state and usenavigate
  const {isLoading, showAlert} = useAppContext()

  const toggleMember = () => {
    setValues({...values, isMember:!values.isMember})
  }

  const handleChange = (e) => {
    setValues(e.target.value)
    console.log(e.target)
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target)
  }

  return (
    <div>
      <h1>{values.isMember ? 'Login': 'Register'}</h1>
      {showAlert && <Alert />}
      <form className='form-control w-fit max-w-xs'>
        <FormRow type="text" name="name" value={values.name} handleChange={handleChange}/>
        <FormRow type="email" name="email" value={values.email} handleChange={handleChange}/>
        <FormRow type="password" name="password" value={values.password} handleChange={handleChange}/>
        <button type="submit" className="btn btn-block mt-2" onSubmit={handleSubmit}>submit</button>
      </form>
      <button type="button" onClick={toggleMember} className="btn btn-link">member?</button>
    </div>
  )
}