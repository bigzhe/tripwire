


const attackPattern = (state = 'Loading', action) => {
  switch (action.type) {
    case 'PARSE_LOG':
      return {

      }
    case 'INIT_ATTACKPATTERN':
      return action.data
    default:
      return state
  }
}

export default attackPattern
