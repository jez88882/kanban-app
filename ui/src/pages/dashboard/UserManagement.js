import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/appContext'
import { Modal, FormRow, Alert } from '../../components'

const initialState = {
  username: 'test000',
  email: 'test000@email.com',
  password: '123456A!',
}

const UserManagement = () => {
  const [values, setValues] = useState(initialState)

  const { isLoading, displayAlert, createUser } = useAppContext()

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
    <div>
      <h1>User Management</h1>
      <Modal id="create-user-form" label="create new user">
        <form className='form-control w-fit max-w-xs' onSubmit={handleSubmit}>
          {displayAlert && <Alert />}
          <FormRow type="text" name="username" value={values.username} handleChange={handleChange}/>
          <FormRow type="email" name="email" value={values.email} handleChange={handleChange}/>
          <FormRow type="password" name="password" value={values.password} handleChange={handleChange}/>
          <button type="submit" className="btn btn-block mt-2" disabled={isLoading}>Create</button>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;