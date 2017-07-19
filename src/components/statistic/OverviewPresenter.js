import React from 'react'
import {Table, Grid, Container, Button, Header, List, Divider, Accordion, Icon} from 'semantic-ui-react'

import ReactTable from 'react-table'

import TracePanel from './TracePanel'



const OverviewPresenter = ({model, overviewFilter, dispatchSetOverviewTrace}) => {

  const traces = Object.keys(model.Statistic.traces)

  const columns = [{
    Header: 'User',
    accessor: 'user' // String-based value accessors! 
  }, {
    Header: 'Time',
    accessor: 'time',
  }]

  const buildTracePanel = (trace) => { 
    return [
      (<Accordion.Title>
        <Icon name='dropdown' />
        {trace.replace(/ /g, ' -> ')}
      </Accordion.Title>),
      (<Accordion.Content>
        <ReactTable
          data={model.Statistic.traces[trace]}
          columns={columns}
          defaultPageSize={10}
          filterable={false}
        />
      </Accordion.Content>)
    ]
  }

  const handleTraceClick = (index, trace) => {
    console.log(trace)
    if (trace === overviewFilter.OverView.trace) {
      trace = ''
    }
    dispatchSetOverviewTrace(trace)
  }



  return (
    <div>
      <Container fluid>
        <Grid >
          <Grid.Row>
            <Grid.Column width={5}>
              <Header>Complete attack traces</Header>
              <Accordion exclusive={true} onTitleClick={(event, index) => handleTraceClick(index, traces[index])}>
                {traces.map(trace => buildTracePanel(trace) )} 
              </Accordion>
            </Grid.Column>
            <Grid.Column width={11}>

            </Grid.Column>
          </Grid.Row>
        </Grid>

      </Container>
    </div>
  )
}
export default OverviewPresenter
