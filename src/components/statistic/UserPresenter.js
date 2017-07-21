import React from 'react'
import {Table, Grid, Container, Button, Header, List, Divider, Accordion, Icon} from 'semantic-ui-react'

import ReactTable from 'react-table'

import TracePanel from './TracePanel'
// import UserCharts from './UserCharts'


const UserPresenter = ({model, overviewFilter, dispatchSetOverviewUser, dispatchHighlightTrace}) => {

  const columns = [{
    Header: 'Trace',
    accessor: 'trace' // String-based value accessors! 
  }, {
    Header: 'Transition',
    accessor: 'transition',
  }, {
    Header: 'Timeout',
    accessor: 'timeout',
  }]

  const traceColumns = [{
    Header: 'Trace',
    accessor: 'trace',
  }, {
    Header: 'Time',
    accessor: 'time',
  }]


  const handleUserClick = (index, user) => {
    dispatchSetOverviewUser(user)
  }

  const getUsers = () => {
    return Object.keys(model.Statistic.moves)
  }
  
  const users = getUsers()
  const processTraceData = (traces) => {
    const result = {}
    Object.keys(traces).forEach(trace => {
      traces[trace].forEach(({user, time}) => {
        result[user] = result[user] || []
        result[user].push({
          trace, time
        })
      }) 
    })
    return result
  }

  const buildUserPanel = (user, i) => {
    return [
      (<Accordion.Title>
        <Icon name='dropdown' />
          {i+1}: {user}
      </Accordion.Title>),
      (<Accordion.Content>
        <ReactTable
          data={processTraceData(model.Statistic.traces)[user]}
          columns={traceColumns}
          defaultPageSize={5}
          filterable={false}
        />
        <br/>
        <ReactTable
          data={processTraceData(model.Statistic.traces)[user]}
          columns={traceColumns}
          defaultPageSize={5}
          filterable={false}
        />
        <br/>
        <ReactTable
          data={processTraceData(model.Statistic.traces)[user]}
          columns={traceColumns}
          defaultPageSize={5}
          filterable={false}
        />
      </Accordion.Content>)
    ]
  }
  const buildTracePanel = (trace, i, user) => { 
    return [
      (<Accordion.Title>
        <Icon name='dropdown' />
        {i+1}: {trace.replace(/ /g, ' -> ')}
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


  return (
    <div>
      <Container fluid>
        <Grid >
          <Grid.Row>
            <Grid.Column width={5}>
              <Header>Users</Header>
              <Accordion exclusive={true} onTitleClick={(event, index) => handleUserClick(index)}>
                 {users.map((user, i) => buildUserPanel(user, i) )}  
              </Accordion>
            </Grid.Column>
            <Grid.Column width={11}>
               {/* <UserCharts 
                data={users}
                overviewFilter={overviewFilter}
              />  */}
            </Grid.Column>
          </Grid.Row>

        </Grid>

      </Container>
    </div>
  )
}
export default UserPresenter
