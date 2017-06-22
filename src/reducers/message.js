const initialState = {
  currentLog: {
    user: '',
    action: [],
  },
  logHistory: []
}

const message = (state = [], action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return [...state, action.data]
    case 'UPDATE_MESSAGE':
      return state.map(m => 
        (m._id === action.data._id)
        ? action.data
        : m
      )
    case 'DELETE_MESSAGE':
      const index = state.findIndex(m => m._id === action._id)
      console.log('delete index', index)
      return [...state.slice(0, index),
              ...state.slice(index+1)]
    case 'DELETE_ALL_MESSAGES':
      return []
    case 'INIT_MESSAGES':
      return action.data
    default:
      return state
  }
}

export default message
