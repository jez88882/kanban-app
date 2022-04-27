import { useState, useEFfect } from 'react';
import { Axios } from 'axios';
import { FormRow, Alert } from '../components'
import { useAppContext } from '../context/appContext';

const initialState = {
  email: '',
  password: ''
}

const Login = async () => {
  const response = Axios.post('/api/v1/login', );
  const
}
export default function Login() {
  const [values, setValues] = useState(initialState)

  // global state and usenavigate
  const {isLoading, showAlert} = useAppContext()

  const handleChange = (e) => {
    setValues(e.target.value)
  }
  
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
  }

  return (
    <div className='content-center'>
      <h1>Login</h1>
      {showAlert && <Alert />}
      <form className='form-control w-fit max-w-xs'>
        <FormRow type="email" name="email" value={values.email} handleChange={handleChange}/>
        <FormRow type="password" name="password" value={values.password} handleChange={handleChange}/>
        <button type="submit" className="btn btn-block mt-2" onSubmit={handleSubmit}>Login</button>
      </form>
    </div>
  )
}