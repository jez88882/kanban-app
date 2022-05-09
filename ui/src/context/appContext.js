import axios from 'axios';
import React,{ useContext } from 'react'
import { useImmerReducer} from 'use-immer'
import {  DISPLAY_ALERT, 
          CLEAR_ALERT, 
          LOGIN_USER_BEGIN, 
          LOGIN_USER_SUCCESS, 
          LOGIN_USER_ERROR, 
          CREATE_USER_BEGIN,
          CREATE_USER_SUCCESS, 
          LOGOUT_USER_SUCCESS,
          SET_LOCATION,
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
  is_admin: null,
  // token: null
  location: null,
}

const AppContext = React.createContext();
const AppProvider = ({children}) => {

  const [state, dispatch] = useImmerReducer(reducer, initialState)

  const setLocation = (path) => {
    dispatch({
      type: SET_LOCATION,
      payload: path
    })
  }
  
  const checkGroup = async (id, userGroup) => {
    const response = await axios.get(`/api/v1/users/${id}/groups?filter=${userGroup}`)
    return response.data.data
  }

  const fetchUser = async () => {
    const response = await axios.get('/api/v1/auth')
    const user =  response.data.user

    const is_admin = await checkGroup(user.id, "admin")
    dispatch({
      type: LOGIN_USER_SUCCESS,
      payload: { user, is_admin }
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

  const loginUser = async (currentUser) => {
    console.log('login user function app context')
    dispatch({type: LOGIN_USER_BEGIN})
    try {
      const response = await axios.post('/api/v1/login', currentUser)
      
      const { user, token } = response.data

      const is_admin = await checkGroup(user.id, "admin")

      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: { user, token, is_admin }
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
          text: error.response.data.errMessagef
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
  <AppContext.Provider value={{...state, displayAlert, clearAlert, loginUser, fetchUser, createUser, disableUser, logoutUser, setLocation }}>
    {children}
  </AppContext.Provider>);
}

const useAppContext = () => {
  return useContext(AppContext)
}

export { AppProvider, useAppContext }
