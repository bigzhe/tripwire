const initialState = {
  showType: 'UserView',
  id: 's1'
}


const presentFilter = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PRESENT_FILTER':
      return {
        showType: action.showType,
        id: action.id || state.id
      }
    default:
      return state
  }
}

export default presentFilter
