import React from 'react'
import {Table, Grid, Container, Button, Header, List, Divider, Accordion, Icon} from 'semantic-ui-react'

import ReactTable from 'react-table'

import TracePanel from './TracePanel'
import OverviewCharts from './OverviewCharts'


const TransitionPresenter = ({model, overviewFilter, dispatchSetOverviewTransition}) => {

  const users = Object.keys(model.Statistic.moves)
  const flatObject = (o) => {
    const result = []
    Object.keys(o).forEach(key => {
      o[key].forEach(tuple => {
        result.push({
          name: key,
          ...tuple
        })
      })
    })
    return result
  }  
  const parseMoves = (moves) => {
    const parsedMoves = {}
    console.log(moves)
    users.forEach(user => {
      console.log(user, moves[user]);
      Object.entries(moves[user]).forEach(([move, times]) => {
        parsedMoves[move] = parsedMoves[move] || []
        parsedMoves[move].push({
          user, times
        })
      })
    })
    console.log(parsedMoves)
    return parsedMoves
  }


  const moves = parseMoves(model.Statistic.moves)
  console.log(moves)

  const columns = [{
    Header: 'User',
    accessor: 'user' // String-based value accessors! 
  }, {
    Header: 'Times',
    accessor: 'times',
  }]

  const buildTransitionPanel = (transition, i) => { 
    return [
      (<Accordion.Title>
        <Icon name='dropdown' />
        {i+1}: {transition.replace(/ /g, ' -> ')}
      </Accordion.Title>),
      (<Accordion.Content>
        <ReactTable
          data={moves[transition]}
          columns={columns}
          defaultPageSize={10}
          filterable={false}
        />
      </Accordion.Content>)
    ]
  }

  const handleTransitionClick = (index, transition) => {
    console.log(transition)
    if (transition === overviewFilter.OverView.transition) {
      transition = ''
    }
    dispatchSetOverviewTransition(transition)
  }



  return (
    <div>
      <Container fluid>
        <Grid >
          <Grid.Row>
            <Grid.Column width={5}>
              <Header>Transitions</Header>
              <Accordion exclusive={true} onTitleClick={(event, index) => handleTransitionClick(index, Object.keys(moves)[index])}>
                {Object.keys(moves).map((transition, i) => buildTransitionPanel(transition, i) )} 
              </Accordion>
            </Grid.Column>
            <Grid.Column width={11}>
              <OverviewCharts 
                data={model.Statistic}
                overviewFilter={overviewFilter}
              />
            </Grid.Column>
          </Grid.Row>

        </Grid>

      </Container>
    </div>
  )
}
export default TransitionPresenter
