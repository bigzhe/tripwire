import React from 'react'
import {Container, Button, Header, List, Divider, Accordion, Icon, Table} from 'semantic-ui-react'

import TracePanel from './TracePanel'

const OverviewPresenter = ({model, patterns}) => {

  const traces = Object.keys(model.Statistic.traces)

  const buildTracePanel = (trace) => { 
    return [
      (<Accordion.Title>
        <Icon name='dropdown' />
        {trace.replace(/ /g, ' -> ')}
      </Accordion.Title>),
      (<Accordion.Content>
        <Table collapsing>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>User</Table.HeaderCell>
              <Table.HeaderCell>Time</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {model.Statistic.traces[trace].map((record, i) => (
              <Table.Row key={record.user + record.time + i}>
                <Table.Cell>{record.user}</Table.Cell>
                <Table.Cell>{record.time}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Accordion.Content>)
    ]
  }

  const handleTraceClick = (index, trace) => {
    console.log(trace)
    console.log(index)
  }

  return (
    <div>
      <Container>
        <Header>Complete attack traces</Header>
        <Accordion exclusive={true} onTitleClick={(event, index) => handleTraceClick(index, traces[index])}>
           {traces.map(trace => buildTracePanel(trace) )} 
        </Accordion>
      </Container>
    </div>
  )
}
export default OverviewPresenter
