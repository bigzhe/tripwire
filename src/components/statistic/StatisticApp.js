import React, {Component} from 'react'
import {connect} from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {Grid, Image, Container, Menu, Divider} from 'semantic-ui-react'

import StatisticPresenterContainer from '../../containers/StatisticPresenterContainer'
import LiveGraphContainer from '../../containers/LiveGraphContainer'

import {setOverviewFilter} from '../../actions'

import * as api from '../../api'

class StatisticAppComponent extends Component {
  componentWillMount() {
    const {fetchModel} = this.props
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
        <Container fluid style={divStyle}>

          <Grid>
            <Grid.Row>
              <Grid.Column width={11}>
                <StatisticPresenterContainer />
              </Grid.Column>
                
              <Grid.Column width={5}>
                <LiveGraphContainer />
              </Grid.Column>
            </Grid.Row>
          </Grid>

        </Container>
      </div>
      </MuiThemeProvider>
    )
  }
}

const divStyle = {
  // background: "#eee",
  padding: "20px",
  // margin: "20px"
};

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchModel: () => {
    return api
      .fetchModel()
      .then(response => {
        dispatch(setOverviewFilter('TraceView'))
        dispatch({type: 'server/disconnect'})
        dispatch({type: 'INIT_MODEL', data: response.model})
        dispatch({type: 'INIT_ATTACKPATTERN', data: response.attackPattern})
        dispatch({type: 'REFRESH_GRAPHCONFIG'})
      }, error => {
        console.log('fetch error')
      })
  }
})

const StatisticApp = connect(mapStateToProps, mapDispatchToProps)(StatisticAppComponent)

export default StatisticApp
