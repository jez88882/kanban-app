import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FormRow, Alert } from '../components'
import { useAppContext } from '../context/appContext'


export default function Login() {
  const initialState = {
    username: 'testuser',
    password: '123456A!',
    isMember: false
  }
  const [values, setValues] = useState(initialState)

  // global state and usenavigate
  const {isLoading, displayAlert, loginUser, user, clearAlert, location } = useAppContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate(location)
        clearAlert()
      }, 50)
    }
  }, [user, navigate])

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = values
    if (username==="" || !password==="") {
      displayAlert({
        type: 'error',
        text: 'please enter all values'
      })
      return
    }
    try {
      loginUser({username, password})
      displayAlert({
        type:'success',
        text:'success. logging in...'
      })
      
    } catch (error) {
      displayAlert(
        'error',
        error.response.errMessage
      )
    }
  }

  return (
    <div className="hero min-h-screen bg-base-100">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className='text-5xl font-bold my-2'>Login</h1>
          {displayAlert && <Alert />}
          <form className='form-control w-fit max-w-xs' onSubmit={handleSubmit}>
            <FormRow type="username" name="username" value={values.username} labelText="Username" handleChange={handleChange}/>
            <FormRow type="password" name="password" value={values.password} labelText="Password" handleChange={handleChange}/>
            <button type="submit" className="btn btn-block mt-2" disabled={isLoading}>Login</button>
          </form>
        </div>
      </div>
    </div>
  )
}
