const initialState = {
  showType: 'OverView',
  OverView: {
    // trace: ''
  },
  UserView: {},
  StateView: {},
}


const overviewFilter = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_OVERVIEW_TRACE':
      // action.trace
      return {
        ...state,
        OverView: {
          ...state.OverView,
          trace: action.trace
        }
      }
    default:
      return state
  }
}

export default overviewFilter
