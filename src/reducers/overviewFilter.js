const initialState = {
  showType: 'OverView',
  OverView: {
    // trace: ''
  },
  TransitionView: {

  },
  UserView: {},
  StateView: {},
}


const overviewFilter = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_OVERVIEW_FILTER':
      return {
        ...state,
        showType: action.showType,
      }
    case 'SET_OVERVIEW_TRACE':
      // action.trace
      return {
        ...state,
        OverView: {
          ...state.OverView,
          trace: action.trace
        }
      }
    case 'SET_OVERVIEW_TRANSITION':
      return {
        ...state,
        OverView: {
          ...state.OverView,
          transition: action.transition
        }
      }
    default:
      return state
  }
}

export default overviewFilter
