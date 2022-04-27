import React, { useState, useEffect } from 'react';
import Axios from 'axios';

function Dashboard(props) {
  
  const [users, setUsers] = useState([]);

  const fetchData = async ()=> {
    const response = await Axios.get('/api/v1/users')
    const users = await response.json();
    return users
  }

  useEffect(()=>{
    const data = fetchData();
    console.log(data);
    setUsers(data);
    console.log(users);
  },[]);

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {/* {users.map(user=><li>{user.id}: {user.username}</li>)} */}
      </ul>
    </div>

  );
}

export default Dashboard;