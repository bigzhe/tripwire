import React from 'react'
import {Table, Grid, Container, Button, Header, List, Divider, Accordion, Icon} from 'semantic-ui-react'

import ReactTable from 'react-table'

import TracePanel from './TracePanel'
import TimeoutCharts from './TimeoutCharts'


const TimeoutPresenter = ({model, overviewFilter, dispatchSetOverviewTimeout, dispatchHighlightTrace}) => {

  const users = Object.keys(model.Statistic.timeouts)
  const parseTimeouts = (timeouts) => {
    const parsedTimeouts = {}
    users.forEach(user => {
      Object.entries(timeouts[user]).forEach(([timeout, times]) => {
        parsedTimeouts[timeout] = parsedTimeouts[timeout] || []
        parsedTimeouts[timeout].push({
          user, times
        })
      })
    })
    return parsedTimeouts
  }


  const timeouts = parseTimeouts(model.Statistic.timeouts)
  console.log(timeouts)

  const columns = [{
    Header: 'User',
    accessor: 'user' // String-based value accessors! 
  }, {
    Header: 'Times',
    accessor: 'times',
  }]

  const buildTimeoutPanel = (timeout, i) => { 
    return [
      (<Accordion.Title>
        <Icon name='dropdown' />
        {i+1}: {timeout.replace(/ /g, ' -> ')}
      </Accordion.Title>),
      (<Accordion.Content>
        <ReactTable
          data={timeouts[timeout]}
          columns={columns}
          defaultPageSize={10}
          filterable={false}
        />
      </Accordion.Content>)
    ]
  }

  const handleTimeoutClick = (index, timeout) => {
    if (timeout === overviewFilter.OverView.timeout) {
      timeout = ''
    }
    dispatchSetOverviewTimeout(timeout)
    dispatchHighlightTrace(timeout)
  }



  return (
    <div>
      <Container fluid>
        <Grid >
          <Grid.Row>
            <Grid.Column width={5}>
              <Header>Timeouts</Header>
              <Accordion exclusive={true} onTitleClick={(event, index) => handleTimeoutClick(index, Object.keys(timeouts)[index])}>
                {Object.keys(timeouts).map((transition, i) => buildTimeoutPanel(transition, i) )} 
              </Accordion>
            </Grid.Column>
            <Grid.Column width={11}>
               <TimeoutCharts 
                data={timeouts}
                overviewFilter={overviewFilter}
              /> 
            </Grid.Column>
          </Grid.Row>

        </Grid>

      </Container>
    </div>
  )
}
export default TimeoutPresenter
