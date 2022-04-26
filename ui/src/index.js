import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import './index.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import reportWebVitals from './reportWebVitals';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


function App(props) {
  const [loggedIn, setLoggedIn] = useState(false);
  
  // function renderPage(element){
  //   // debugger;
  //   return loggedIn ? element : <Login setLoggedIn={setLoggedIn}/>
  // }

  return(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={loggedIn ? <Dashboard setLoggedIn={setLoggedIn}/>:<Login setLoggedIn={setLoggedIn}/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
