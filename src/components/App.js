import React, { Component } from 'react'
import {connect} from 'react-redux'
import LiveGraphContainer from '../containers/LiveGraphContainer'
import LogGenerator from '../containers/LogGenerator'
import ModelPresenterContainer from '../containers/ModelPresenterContainer'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {Grid, Image, Container, Menu, Divider} from 'semantic-ui-react'

import { setVisibilityFilter } from '../actions'

import * as api from '../api'

class AppComponent extends Component {
  componentWillMount () {
    const { fetchModel, dispatchSetVisibilityFilter } = this.props
    console.log('will mount')
    console.log(this.props.history)
    // console.log(this.props.match.params.targetPattern)
    const targetPattern = this.props.match.params.targetPattern || 'pattern1'
    // console.log(targetPattern)
    dispatchSetVisibilityFilter(targetPattern)
    fetchModel()
  }

  render() {
    return (
      <MuiThemeProvider>
      <div>
        <Menu>
          <Menu.Item header>Insider Detection System</Menu.Item>
        </Menu>
        <Container>

          <Grid columns={2}>
            <Grid.Row>
              <Grid.Column>
                <Grid.Row>
                  <LogGenerator />
                </Grid.Row>
                <br/>
                <br/>
                <Grid.Row>
                  <ModelPresenterContainer />
                </Grid.Row>
              </Grid.Column>
              <Grid.Column>
                <LiveGraphContainer 
                  history={this.props.history}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>

        </Container>
      </div>
      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchModel: () => {
    return api.fetchModel().then(
      response => {
        dispatch({type: 'INIT_MODEL', data: response.model})
        dispatch({type: 'INIT_ATTACKPATTERN', data: response.attackPattern})
        dispatch({type: 'REFRESH_GRAPHCONFIG'})
      }, error => {
        console.log('fetch error')
      }
    )
  },
  dispatchSetVisibilityFilter: (pattern) => {
    dispatch(setVisibilityFilter(pattern))
  },
})

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent)

export default App
