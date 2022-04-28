import axios from 'axios'

import {  DISPLAY_ALERT, 
          CLEAR_ALERT, 
          LOGIN_USER_BEGIN, 
          LOGIN_USER_SUCCESS, 
          LOGIN_USER_ERROR } from "./actions"

const reducer = (draft, action) => {
  switch (action.type) {
    case DISPLAY_ALERT:
      draft.showAlert = true
      draft.alertType = 'error'
      draft.alertText = 'please provide all values'
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
      draft.token = action.payload.token
      draft.user =  action.payload.user
      // draft.location =  action.payload.location
      draft.showAlert = true
      draft.alertType = 'success'
      draft.alertText = 'Success. Logging in...'
      return
    case LOGIN_USER_ERROR:
      draft.isLoading = false
      draft.showAlert = true
      draft.alertType = 'error'
      draft.alertText = action.payload.message
      return
    default:
      throw new Error(`no such action: ${action.type}`)
  }
}

export default reducer