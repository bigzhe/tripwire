import React, { Component } from 'react'
import {connect} from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {Grid, Image, Container, Menu, Divider} from 'semantic-ui-react'

import StaticGraph from './StaticGraph'

import * as api from '../api'

class StatisticAppComponent extends Component {
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
          <Menu.Item header>Statistic</Menu.Item>
        </Menu>
        <Container>

          <Grid columns={2}>
            <Grid.Row>
              <Grid.Column>
                <Grid.Row>
                  {/* <LogGenerator /> */}
                </Grid.Row>
                <br/>
                <br/>
                <Grid.Row>
                  {/* <ModelPresenterContainer /> */}
                </Grid.Row>
              </Grid.Column>
              <Grid.Column>
                {/* <StaticGraph/> */}
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
        dispatch({type: 'server/disconnect'})
        dispatch({type: 'INIT_MODEL', data: response.model})
        dispatch({type: 'INIT_ATTACKPATTERN', data: response.attackPattern})
        dispatch({type: 'REFRESH_GRAPHCONFIG'})
      }, error => {
        console.log('fetch error')
      }
    )
  },
})

const StatisticApp = connect(mapStateToProps, mapDispatchToProps)(StatisticAppComponent)

export default StatisticApp
