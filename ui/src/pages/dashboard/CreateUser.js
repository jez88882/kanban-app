import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/appContext'
import { FormRow, Alert } from '../../components'

const initialState = {
  username: 'test000',
  email: 'test000@email.com',
  password: '123456A!',
}

const CreateUser = () => {
  const [values, setValues] = useState(initialState)

  const { isLoading, showAlert, displayAlert, createUser } = useAppContext()

  // use to close modal and go back to user management page
  // useEffect(() => {
  //   if (condition) {
  //     setTimeout(() => {
  //       navigate('/somewhere')
  //     }, 500)
  //   }
  // }, [user, navigate])

  
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, email, password } = values
    if (email==="" || !password==="" || username==="") {
      displayAlert({
        type: 'error',
        text: 'enter all values'
      })
      return
    }

    const newUser = { username, email, password }
    createUser(newUser);
    displayAlert({
      type: 'success',
      text: 'created!'
    })
  }

  return (
    <>
      <h1 className="font-bold text-lg">Create User</h1>
      <form className='form-control w-fit max-w-xs' onSubmit={handleSubmit}>
        { showAlert && <Alert/>}
        
        <FormRow type="text" name="username" labelText="Username" value={values.username} handleChange={handleChange}/>
        <FormRow type="email" name="email" labelText="Email" value={values.email} handleChange={handleChange}/>
        <FormRow type="password" name="password" labelText="Password" value={values.password} handleChange={handleChange}/>
        <button type="submit" className="btn btn-block mt-2" disabled={isLoading}>Create</button>
      </form>
    </>
  );
};

export default CreateUser;