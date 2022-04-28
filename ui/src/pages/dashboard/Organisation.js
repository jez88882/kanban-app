import axios from 'axios';
import { useState, useEffect } from 'react';


const Organization = () => {
  const [users, setUsers] = useState([])

  const fetchUsers = async () => {
    console.log('fetching users')
    const res = await axios.get('/api/v1/users')
    setUsers(res.data.data)
  }
  
  useEffect(()=>{
    fetchUsers();
  },[])

  const listItems = users.map((user) =>
    <li key={user.id}>{user.username}</li>
  );
  return (
    <div>
      organization
    <ul>
      {listItems}
    </ul>
    </div>
  );
};

export default Organization;