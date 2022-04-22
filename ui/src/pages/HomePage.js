import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Page from '../components/Page';

const axios = require('axios');

export default function HomePage(props) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Make a request for a user with a given ID
        fetch("http://localhost:8080/users")
        .then(response => response.json())
        .then(data => console.log(data));
      },[]);

    return(
        <Page title="Home">
            <h1>Home</h1>
            <Link to="/login">Login</Link>
            {users.map((user) => <li>{user.username}</li>)}
        </Page>
    );
}