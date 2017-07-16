import React from 'react'
import {connect} from 'react-redux'
import {openSnackBar, closeSnackBar, setSnackbarMessage, userMoveToMultiple, updateCurrentLogAction, addCurrentLogUser, addLog, userMoveTo, refreshGraphConfig} from '../actions'
import {severalHoursLater} from '../utils/dateUtils'
import Snackbar from 'material-ui/Snackbar';

import {
  TextArea,
  Container,
  Button,
  Header,
  Form,
  Checkbox,
  Dropdown
} from 'semantic-ui-react'

let LogGenerator = ({
  dispatchUserMoveToMultiple,
  dispatchAddCurrentLogUser,
  dispatchUpdateCurrentLogAction,
  dispatchUserMoveTo,
  dispatch,
  logHistory,
  model,
  snackbar,
  attackPattern,
  dispatchAddLog,
  dispatchRefreshGraphConfig,
  dispatchSetSnackbarMessage,
  dispatchCloseSnackBar,
}) => {


  return (
    <Container>
      <Header >
        Processing Log
      </Header>

      <Form>
        <TextArea
          placeholder='Log history showing here...'
          value={logHistory
          .logHistory
          .map((l) => l.text)
          .reverse()
          .join('------------\n')}/>
      </Form>
        <Snackbar
          open={snackbar.open}
          message={snackbar.message}
          // action="undo"
          autoHideDuration={3000}
          onRequestClose={() => {dispatchCloseSnackBar()}}
          // onRequestClose={console.log('close')}
        />
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {snackbar: state.snackbar, model: state.model, attackPattern: state.attackPattern, logHistory: state.log}
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchUserMoveTo: (id, moveFrom, moveTo, expirationTime) => {
    dispatch(userMoveTo(id, moveFrom, moveTo, expirationTime))
  },
  dispatchUserMoveToMultiple: (id, moves) => {
    dispatch(userMoveToMultiple(id, moves))
  },
  dispatchRefreshGraphConfig: () => {
    dispatch(refreshGraphConfig())
  },
  dispatchAddLog: (log) => {
    dispatch(addLog(log))
  },
  dispatchAddCurrentLogUser: (user) => {
    dispatch(addCurrentLogUser(user))
  },
  dispatchUpdateCurrentLogAction: (action) => {
    dispatch(updateCurrentLogAction(action))
  },
  dispatchSetSnackbarMessage: (message) => {
    dispatch(setSnackbarMessage(message))
  },
  dispatchCloseSnackBar: () => {
    dispatch(closeSnackBar())
  }

})

LogGenerator = connect(mapStateToProps, mapDispatchToProps)(LogGenerator)

export default LogGenerator
