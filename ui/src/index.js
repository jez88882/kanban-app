import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

import './index.css';
import { Dashboard, Login, Register, Landing, Error } from './pages'
import { AppProvider } from './context/appContext'
import reportWebVitals from './reportWebVitals';
import Axios from 'axios';

function App(props) {
  const [loggedIn, setLoggedIn] = useState(false);

  return(
    <React.StrictMode>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/landing" element={<Landing/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="*" element={<Error />}/>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
