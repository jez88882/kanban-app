import axios from 'axios';
import React,{ useEffect, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useImmerReducer} from 'use-immer'
import {  DISPLAY_ALERT, 
          CLEAR_ALERT, 
          LOGIN_USER_BEGIN, 
          LOGIN_USER_SUCCESS, 
          LOGIN_USER_ERROR, 
          CREATE_USER_BEGIN,
          CREATE_USER_SUCCESS, 
          LOGOUT_USER_SUCCESS
        } from './actions';
import reducer from './reducer'

// const token = localStorage.getItem('token')
// const user = localStorage.getItem('user')
// const location = localStorage.getItem('location')

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: null,
  // token: null
  // userLocation: location || ''
}

const AppContext = React.createContext();
const AppProvider = ({children}) => {

  const [state, dispatch] = useImmerReducer(reducer, initialState)

  const fetchUser = async () => {
    const response = await axios.get('/api/v1/auth')
    const user =  response.data.user
    dispatch({
      type: LOGIN_USER_SUCCESS,
      payload: { user }
    })
  }

  const displayAlert = (alerttype, alerttext) => {
    dispatch({
      type: DISPLAY_ALERT,
      payload: { 
        type: alerttype, 
        text: alerttext }
    })
  }
  
  const clearAlert = () => {
    dispatch({type: CLEAR_ALERT})
  }

  // const addUserToLocalStorage = () => {
    // localStorage.setItem('user', JSON.stringify(user))
    // localStorage.setItem('token', token)
    // localStorage.setItem('location', location)
  // }

  const loginUser = async (currentUser) => {
    dispatch({type: LOGIN_USER_BEGIN})
    try {
      const response = await axios.post('/api/v1/login', currentUser)
      console.log(response.data)
      // console.log(data)
      const { user, token} = response.data
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: { user, token, location: 'dashboard' }
      })
      
      setTimeout(()=>{
        clearAlert()
      }, 1000)
      
    } catch (error) {
      console.log(error.response)
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: {
          message: error.response.data.errMessage
        }
      })
    }
  }

  const createUser = async (currentUser) => {
    dispatch({type: CREATE_USER_BEGIN})
    try {
      const response = await axios.post('/api/v1/users', currentUser)
      // console.log(response.data)
      // const { user, token} = response.data
      dispatch({
        type: CREATE_USER_SUCCESS
      })
      // local storage later
      // addUserToLocalStorage({user, token, location: 'dashboard'})
    } catch (error) {
      console.log(error.response)
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: {
          message: error.response.data.errMessage
        }
      })
    }
    
    setTimeout(()=>{
      clearAlert()
    }, 5000)
  }
  
  const disableUser = async (userId) => {
    try {
      const response = await axios.get(`/api/v1/users/${userId}/disable`)
      dispatch({
        type: DISPLAY_ALERT,
        payload: {
          type: 'success',
          text: `user ${userId} disabled`
        }
      })

      setTimeout(()=>{
        dispatch({type: CLEAR_ALERT})
      }, 5000)
      
    } catch (error) {
      console.log(error.response)
      dispatch({
        type: DISPLAY_ALERT,
        payload: {
          type: 'error',
          text: error.response.data.errMessage
        }
      })
    }
  }

  const logoutUser = async () => {
    try {
      const res = await axios.get('/api/v1/logout');
      dispatch({
        type: LOGOUT_USER_SUCCESS
      })
      dispatch({
        type: DISPLAY_ALERT,
        payload:{
          type: 'success',
          text: 'logged out successfully'
        }
      })
      
    } catch (error) {
      
    }
  }

  return (
  <AppContext.Provider value={{...state, displayAlert, clearAlert, loginUser, fetchUser, createUser, disableUser, logoutUser }}>
    {children}
  </AppContext.Provider>);
}

const useAppContext = () => {
  return useContext(AppContext)
}

export { AppProvider, useAppContext }
