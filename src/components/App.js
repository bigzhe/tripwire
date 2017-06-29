import React, { Component } from 'react'
import {connect} from 'react-redux'
import LiveGraphContainer from '../containers/LiveGraphContainer'
import LogGenerator from '../containers/LogGenerator'
import ModelPresenterContainer from '../containers/ModelPresenterContainer'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {Grid, Image, Container, Menu, Divider} from 'semantic-ui-react'

import * as api from '../api'

class AppComponent extends Component {
  componentWillMount () {
    const { fetchModel } = this.props
    console.log('will mount')
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
                  {/*<LogGenerator />*/}
                </Grid.Row>
                <br/>
                <br/>
                <Grid.Row>
                  <ModelPresenterContainer />
                </Grid.Row>
              </Grid.Column>
              <Grid.Column>
                <LiveGraphContainer/>
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
})

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent)

export default App
