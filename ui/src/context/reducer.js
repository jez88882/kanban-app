import { DISPLAY_ALERT } from "./actions"

const reducer = (draft, action) => {
  switch (action.type) {
    default:
      return
    case DISPLAY_ALERT:
      draft.showAlert = true
      draft.alertType = 'danger'
      draft.alertText = 'please provide all values'
      return

  }
  throw new Error(`no such action: ${action.type}`)
}

export default reducer