import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Axios } from 'axios';
import { FormRow, Alert } from '../components'
import { useAppContext } from '../context/appContext'

const initialState = {
  email: 'test_id@email.com',
  password: '123456A!',
  isMember: false
}

export default function Login() {
  const [values, setValues] = useState(initialState)

  // global state and usenavigate
  const {isLoading, displayAlert, loginUser, user} = useAppContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate('/')
      }, 2000)
    }
  }, [user, navigate])

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password, isMember } = values
    if (email==="" || !password==="") {
      displayAlert()
      return
    }
    const currentUser = { email, password }
    loginUser(currentUser)
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className='text-5xl font-bold'>Login</h1>
          {displayAlert && <Alert />}
          <form className='form-control w-fit max-w-xs' onSubmit={handleSubmit}>
            <FormRow type="email" name="email" value={values.email} handleChange={handleChange}/>
            <FormRow type="password" name="password" value={values.password} handleChange={handleChange}/>
            <button type="submit" className="btn btn-block mt-2" disabled={isLoading}>Login</button>
          </form>
        </div>
      </div>
    </div>
  )
}
