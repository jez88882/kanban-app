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
      <h1>User Management</h1>
    </div>
  );
};

export default Overview;

