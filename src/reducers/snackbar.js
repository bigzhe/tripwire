const initialState = {
  message: '',
  open: false
}
const snackbar = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SNACKBAR_MESSAGE':
      return {
        open: true,
        message: action.message
      }
    case 'OPEN_SNACKBAR':
      return {
        ...state,
        open: true
      }
    case 'CLOSE_SNACKBAR':
      return {
        ...state,
        open: false
      }
    default:
      return state
  }
}

export default snackbar
