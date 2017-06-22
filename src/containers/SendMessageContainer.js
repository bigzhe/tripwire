import {connect} from 'react-redux'
import {sendMessage, setSent, nextStatus, resetStatus, setSending} from '../actions'
import SendMessage from '../components/SendMessage'
import * as api from '../api'

const mapStateToProps = (state) => {
  return {
    status: state.sendingStatus,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchSendMessage: (msg) => {
    return api.postNewMessage(msg).then(
      response => {
        console.log(response)
        dispatch(setSent())
      },error => {
        console.log('error')
      }
    )
  },
  dispatchNextStatus: () => {
    return dispatch(nextStatus())
  },
  dispatchResetStatus: () => {
    return dispatch(resetStatus())
  },
  dispatchSetSending: () => {
    return dispatch(setSending())
  }
})

const SendMessageContainer = connect(mapStateToProps, mapDispatchToProps)(SendMessage)

export default SendMessageContainer
