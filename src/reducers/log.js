const initialState = {
  currentLog: {
    user: '',
    action: [],
  },
  logHistory: []
}

const log = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_LOG':
      return {
        ...initialState,
        logHistory: [
          ...state.logHistory,
          {
            id: action.id,
            text: '--' + new Date().toLocaleTimeString() + '--' + '\n' + 'User: ' + action.id + '\n' + action.text + '\n',
          }
      ]}
    case 'ADD_CURRENT_LOG_USER':
      return {
        ...state,
        currentLog: {
          ...state.currentLog,
          user: action.user
        }
      }
    case 'UPDATE_CURRENT_LOG_ACTION':
      return {
        ...state,
        currentLog: {
          ...state.currentLog,
          action: action.action
        }
      }
    default:
      return state
  }
}

export default log
