import axios from 'axios'
import { useState, useEffect } from 'react'
import { useAppContext } from '../../context/appContext'
import { Alert, Modal, FormRow } from '../../components'



const Overview = () => {
  const [users, setUsers] = useState([])
  const [values, setValues] = useState({})
  const { showAlert, disableUser, isLoading, displayAlert } = useAppContext()

  const fetchUsers = async () => {
    console.log('fetching users')
    const res = await axios.get('/api/v1/users')
    setUsers(res.data.data)
  }
  
  const handleClick = async (user, index)=>{
    disableUser(user.id)
    const updated = [...users]
    updated[index].is_disabled = true
    setUsers(updated)
  }
  
  const chooseUser = (e) => {
    console.log(e)
    debugger
  }

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }
  
  useEffect(()=>{
    fetchUsers();
  },[])

  const listUsers = users.map( (user, index) =>
    <tr className={`${user.is_disabled ? 'text-sm opacity-50' : 'font-bold'} hover`} onClick={chooseUser}>
      <td>
        <p>{user.username}</p>
      </td>
      <td>
        user group
      </td>
      <td>
        <button className="btn btn-ghost btn-xs" type="submit" onClick={()=>{handleClick(user, index)}} disabled={user.is_disabled}>Disable</button>
      </td>
    </tr>
    )


  return (
    <div>
      organization
      <div className="overflow-x-auto w-full">
      <table className="table w-full">
        {/* <!-- head --> */}
        <thead>
          <tr>
            <th>Name</th>
            <th>User Group</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {/* iterate over users in rows*/}
          {listUsers}
        </tbody>
        {/* <!-- foot --> */}
        <tfoot>
          <tr>
            <th>Name</th>
            <th>User group</th>
            <th></th>
          </tr>
        </tfoot>
        
      </table>
      </div>
      {showAlert && <Alert />} 
      <div>
        <input type="checkbox" id="update-user" class="modal-toggle"/>
          <label for="update-user" class="modal cursor-pointer modal-bottom sm:modal-middle">
            <label class="modal-box relative" for="">
              <form className='form-control w-fit max-w-xs' onSubmit={handleSubmit}>
                <FormRow type="username" name="username" value={values.username} handleChange={handleChange}/>
                <FormRow type="email" name="email" value={values.email} handleChange={handleChange}/>
                <FormRow type="password" name="password" value={values.password} handleChange={handleChange}/>
                <button type="submit" className="btn btn-block mt-2" disabled={isLoading}>Login</button>
              </form>
            </label>
          </label>
      </div>
    </div>
  );
};

export default Overview;

