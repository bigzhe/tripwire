import {connect} from 'react-redux'
// import {fetchMessages} from '../actions'
import Liveboard from '../components/Liveboard'
import * as api from '../api'

const mapStateToProps = (state) => {
  return {
    messages: state.message
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchMessages: () => {
    return api.fetchMessages().then(
      messages => {
        dispatch({type: 'INIT_MESSAGES', data: messages})
      }, 
      error => {
        console.log('fetch error')
      }
    )
  },
})

const LiveBoardContainer = connect(mapStateToProps, mapDispatchToProps)(Liveboard)

export default LiveBoardContainer
