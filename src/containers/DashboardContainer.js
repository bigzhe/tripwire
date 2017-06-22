import {connect} from 'react-redux'
// import {fetchMessages} from '../actions'
import Dashboard from '../components/Dashboard'
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
  updateMessage: (_id, msg) => {
    return api.updateMessage(_id, msg).then(
      response => {
        console.log(response)
      }, 
      error => {
        console.log('update error')
      }
    )
  },
  deleteMessage: (_id) => {
    return api.deleteMessage(_id).then(
      response => {
        console.log(response)
      },
      error => {
        console.log('delete error')
      }
    )
  },
  deleteAllMessage: () => {
    return api.deleteAllMessage().then(
      response => {
        console.log(response)
      }, 
      error => {
        console.log('delete error')
      }
    )
  },
})

const DashboardContainer = connect(mapStateToProps, mapDispatchToProps)(Dashboard)

export default DashboardContainer
