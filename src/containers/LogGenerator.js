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
  // console.log(logHistory) Parse Log !!!
  const parseLog = (user, action) => {
    // dispatchUserMoveTo(id, moveFrom, moveTo, severalHoursLater(2))

    if (!user || !action) {
      dispatchSetSnackbarMessage('User or actions cannot be empty')
      return
    }

    let moves = []
    const initialStates = ['s1', 's2']
    let pattern = attackPattern.pattern1;
    model.UserView[user].forEach((s) => {
      pattern[s.id].children.forEach((c) => {
        if (action.includes(c) && pattern[c].canCommit(user, action)) {          
          moves.push({from: s.id, to: c, expirationTime: severalHoursLater(2)})
        }
      })
    })
    initialStates.forEach((c) => {
        if (action.includes(c) && pattern[c].canCommit(user, action)) {
          moves.push({from: undefined , to: c, expirationTime: severalHoursLater(2)})
        }
    })
    // add moves to the initial states
    // moves = [{to: 's1'}]
    dispatchUserMoveToMultiple(user, moves)
    let output = 'User: ' + logHistory.currentLog.user + '\t Actions: ' + logHistory.currentLog.action + '\n';
    moves.forEach((e) => {
      output += (e.from || 's0') + ' => ' + e.to + '\n'
    })
    dispatchAddLog(output);
  }

  let userData = Object
    .keys(model.UserView)
    .map((k) => {
      return {key: k, value: k, text: k}
    })
  let actionData = Object
    .keys(attackPattern.pattern1)
    .map((k) => {
      return {
        key: k,
        value: k,
        text: 'Commit ' + k
      }
    })

  return (
    <Container>
      <Header >
        Log Generator
        <Header.Subheader>
          Generate log and dispatch to the model
        </Header.Subheader>
      </Header>
      <Form>
        <Form.Field>
          <Dropdown
            placeholder='Select an user'
            search
            selection
            options={userData}
            value={logHistory.currentLog.user}
            onChange={(e, p) => {
            dispatchAddCurrentLogUser(p.value)
          }}/>
        </Form.Field>
        <Form.Field>
          <Dropdown
            placeholder='Select actions'
            search
            selection
            multiple
            options={actionData}
            value={logHistory.currentLog.action}
            onChange={(e, p) => {
            dispatchUpdateCurrentLogAction(p.value)
          }}/>
        </Form.Field>

        <Button
          onClick={(e) => {
          e.preventDefault();
          parseLog(logHistory.currentLog.user, logHistory.currentLog.action)
          
        }}>Submit</Button>
        {
        // <Button onClick={(e) => {
        //   e.preventDefault()
        //   dispatchRefreshGraphConfig()
        // }}>
        //   Load
        // </Button>
        }
      </Form>

      <Header as='h5'>Log History</Header>
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
