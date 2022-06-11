import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useAppContext } from '../context/appContext';

const UserManagement = () =>{
  return(
    <li tabIndex="0">
      <Link to="/users">
        User Management
        <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
      </Link>
      <ul className="p-2 bg-base-100">
        <li><Link to="/users">View All Users</Link></li>
        <li><Link to="/users/new">Create User</Link></li>
        <li><Link to="/users/assign">Assign</Link></li>
      </ul>
    </li>
  )
}

const Navbar = () => {
  const navigate = useNavigate()
  const { user, clearAlert, logoutUser, is_admin } = useAppContext()
 
  useEffect(() => {
    if (!user) {
      setTimeout(() => {
        navigate('/login')
      }, 500)
    }
  }, [user, clearAlert, navigate]) 
  
  const handleLogout = async() => {
    logoutUser();
    setTimeout(()=>{
      clearAlert()
    },2000)
  }

  return (
    <div className="navbar bg-neutral border-b-2">
      <div className="flex-1">
        <Link className="btn btn-ghost normal-case text-xl" to="/applications">Kanban App</Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal p-0">
          <li><Link to="/account" className='font-bold'>{user.username}</Link></li>
          {is_admin ? <UserManagement />:<></>}
          <li><Link to="/applications">Task Management</Link></li>
          <li>
            <Link to="/" onClick={handleLogout}>Logout</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;

