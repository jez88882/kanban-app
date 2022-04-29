import axios from 'axios'

import {  DISPLAY_ALERT, 
          CLEAR_ALERT, 
          LOGIN_USER_BEGIN, 
          LOGIN_USER_SUCCESS, 
          LOGIN_USER_ERROR,
          CREATE_USER_BEGIN,
          CREATE_USER_SUCCESS
        } from "./actions"

const reducer = (draft, action) => {
  switch (action.type) {
    case DISPLAY_ALERT:
      draft.showAlert = true
      draft.alertType = action.payload.type
      draft.alertText = action.payload.text
      return
    case CLEAR_ALERT:
      draft.showAlert = false
      draft.alertType = ''
      draft.alertText = ''
      return
    case LOGIN_USER_BEGIN:
      draft.isLoading = true
      return
    case LOGIN_USER_SUCCESS:
      draft.isLoading = false
      // draft.token = action.payload.token
      draft.user =  action.payload.user
      // draft.location =  action.payload.location
      return
    case LOGIN_USER_ERROR:
      draft.isLoading = false
      draft.showAlert = true
      draft.alertType = 'error'
      draft.alertText = action.payload.message
      return
    case CREATE_USER_BEGIN:
      draft.isLoading = true
      return
    case CREATE_USER_SUCCESS:
      draft.isLoading = false
      draft.showAlert = true
      draft.alertType = 'success'
      draft.alertText = 'Created user!'
      return
    default:
      throw new Error(`no such action: ${action.type}`)
  }
}

export default reducer
