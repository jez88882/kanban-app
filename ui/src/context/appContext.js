import axios from 'axios';
import React,{ useEffect, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useImmerReducer} from 'use-immer'
import { DISPLAY_ALERT, CLEAR_ALERT, LOGIN_USER_BEGIN, LOGIN_USER_SUCCESS, LOGIN_USER_ERROR } from './actions';
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
  // userLocation: location || ''
}

const AppContext = React.createContext();
const AppProvider = ({children}) => {

  const [state, dispatch] = useImmerReducer(reducer, initialState)

  const fetching = async () => {
    const response = await axios.get('/api/v1/auth')
    const user =  response.data.user
    dispatch({
      type: LOGIN_USER_SUCCESS,
      payload: { user }
    })
  }

  const displayAlert = () => {
    dispatch({type: DISPLAY_ALERT})
    // clearAlert()
  }
  
  const clearAlert = () => {
    setTimeout(()=>{
      dispatch({type: CLEAR_ALERT})
    }, 3000)
  }

  const addUserToLocalStorage = () => {
    // localStorage.setItem('user', JSON.stringify(user))
    // localStorage.setItem('token', token)
    // localStorage.setItem('location', location)
  }

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
      // local storage later
      addUserToLocalStorage({user, token, location: 'dashboard'})
    } catch (error) {
      console.log(error.response)
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: {
          message: error.response.data.errMessage
        }
      })
    }
    clearAlert()
  }

  return (
  <AppContext.Provider value={{...state, displayAlert, clearAlert, loginUser, fetching }}>
    {children}
  </AppContext.Provider>);
}

const useAppContext = () => {
  return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext }