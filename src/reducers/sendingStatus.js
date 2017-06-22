const sendingStatus = (state = 'unsent', action) => {
  switch (action.type) {
    case 'RESET':
      return 'unsent'
    case 'NEXT':
      if (state = 'unsent') {
        return 'sendable'
      } else if (state = 'sendable') {
        console.log('here')
        return 'sending'
      } else if (state = 'sending') {
        return 'sent'
      } else if (state = 'sent') {
        return 'unsent'
      }
    case 'SET_SENDING':
      return 'sending'
    case 'SET_SENT':
      return 'sent'
    default:
      return state
  }
}

export default sendingStatus
