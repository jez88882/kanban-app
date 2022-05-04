import axios from 'axios'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAppContext } from '../../context/appContext'
import { Alert, Modal, FormRow } from '../../components'

const initialState = {
  username:"",
}

const AllUsers = () => {
  const [users, setUsers] = useState([])
  const [values, setValues] = useState(initialState)
  const { showAlert, isLoading, clearAlert } = useAppContext()

  const fetchUsers = async () => {
    console.log('fetching users')
    const res = await axios.get('/api/v1/users')
    setUsers(res.data.data)
  }
  
  const handleClick = async (e) => {
    const id = e.currentTarget.dataset.userid
    const res = await axios.get(`/api/v1/users/${id}`)
    const {username, email} = res.data.data
    setValues({ username, email })
    
  }
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }
  // const handleClick = async (user, index)=>{
  //   disableUser(user.id)
  //   const updated = [...users]
  //   updated[index].is_disabled = true
  //   setUsers(updated)
  // }

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log(values.username)
    
    const res = await axios.get(`/api/v1/users?username=${values.username}`)
    setUsers(res.data.data)
    }

  useEffect(()=>{
    fetchUsers();
    clearAlert();
  },[])

  const listUsers = users.map( (user, index) =>
  <Link to={`edit/${user.id}`}>
    <div className={`rounded-box my-2 p-2 ${user.is_disabled ? "bg-base-300 " : "bg-neutral"}`}>
      <p className={user.is_disabled ? "text-slate-400" : ""}>
        {user.username}
      </p>
    </div>
  </Link>
    )


  return (
    <div className='p-4'>
      <h2 className='font-bold text-lg'>All Users</h2>
      <div>
        <form onSubmit={handleSearch}>
          <FormRow type="text" name="username" value={values.username} labelText="Search by username" handleChange={handleChange}/>
          <button type="submit" className="btn btn-block mt-2" disabled={isLoading}>Search</button>
        </form>
        {showAlert && <Alert />}
      </div>
      <div className="w-full justify-items-center">
        {listUsers}
      </div>     
    </div>
  );
};

export default AllUsers;

