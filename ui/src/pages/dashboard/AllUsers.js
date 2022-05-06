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
    const res = await axios.get('/api/v1/users?username=')
    setUsers(res.data.data)
  }
  
  const handleSearch = (e) => {
    e.preventDefault();
    setValues({ ...values, [e.target.name]: e.target.value })
    
    setTimeout(async()=>{
      const res = await axios.get(`/api/v1/users?username=${values.username}`)
      setUsers(res.data.data)
    }, 1000)
  }

  useEffect(()=>{
    fetchUsers();
    clearAlert();
  },[])

  const listUsers = users.map( (user, index) =>
  <Link to={`edit/${user.id}`}>
    <div className={`border border-2 border-primary	rounded-md text-primary hover:bg-primary hover:text-white my-2 p-2 ${user.is_disabled ? "bg-base-300 " : ""}`}>
      <p className={user.is_disabled ? "text-slate-400" : ""}>
        {user.username}
      </p>
    </div>
  </Link>
    )

  return (
    <div className='p-4'>
      <h2 className='font-bold text-2xl'>All Users</h2>
      <div className='w-8/12'>
        <form className='form-control' onSubmit={handleSearch}>
          <div className='w-3/12 flex items-end'>
            <FormRow type="text" name="username" value={values.username} labelText="Search by username" handleChange={handleSearch}/>
            <button type="submit" className="btn btn-primary mt-2 mx-2" disabled={isLoading}>Search</button>
          </div>
        </form>
        {showAlert && <Alert />}
        <div className="w-full justify-items-center">
          {listUsers}
        </div>     
      </div>
    </div>
  );
};

export default AllUsers;

