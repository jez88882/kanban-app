import React from 'react';
import Page from '../components/Page';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

const ROOT_URL = "http://localhost:8080";

const passwordRequirements= "Password has to be 8 to 10 characters and comprise of alphabets, numbers, and special characters";
const pattern="(?=.*\d)(?=.*[a-zA-Z])(?=.*\W).{8,10}";
const justincase = 'error helperText="Invalid email or password"';

export default function LoginPage(props) {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('logging in...');
    const data = {
      username: event.target.elements[0].value,
      password: event.target.elements[2].value
    };
    
    fetch(`${ROOT_URL}/login`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => console.log(res.text()));

  }

  return(
    <Page title="Login">
      <h1>Login</h1>
      <form action="/login" method="post" onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={8}>
            <TextField id="email" label="email" variant="outlined" required/>
          </Grid>
          <Grid item xs={8}>
            <TextField id="password" label="password" variant="outlined" required />
          </Grid>
          <Grid item xs={8}>
            <Button variant="contained" type="submit">Login</Button>
          </Grid>
        </Grid>
      </form>
    </Page>
  );
}