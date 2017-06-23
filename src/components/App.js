import React from 'react'
import LiveGraphContainer from '../containers/LiveGraphContainer'
import LogGenerator from '../containers/LogGenerator'
import ModelPresenterContainer from '../containers/ModelPresenterContainer'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {Grid, Image, Container, Menu, Divider} from 'semantic-ui-react'

const App = () => (
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
            <LiveGraphContainer/>
          </Grid.Column>
        </Grid.Row>
      </Grid>

    </Container>
  </div>
  </MuiThemeProvider>
)

export default App
