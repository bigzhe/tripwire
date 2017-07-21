import React from 'react'
import {
  Grid,
  Container,
  Button,
  Header,
  List,
  Divider,
  Accordion
} from 'semantic-ui-react'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'

import randomColor from 'randomColor'

const TimeoutCharts = ({data, overviewFilter}) => {

  const flatten = (timeouts) => {
    const result = []
    Object
      .entries(timeouts)
      .forEach(([timeout, arr]) => {
        const tuple = {}
        tuple.name = timeout
        arr.forEach(({user, times}) => {
          tuple[user] = times
        })
        result.push(tuple)
      })
    return result
  }
  const getUsers = (timeouts) => {
    const users = {}
    Object
      .keys(timeouts)
      .forEach(key => {
        timeouts[key].forEach(({user, time}) => {
          if (!users[user]) 
            users[user] = true
        })
      })
    return Object.keys(users)
  }

  // name: s1->s2, user1: 10, user2: 20
  const buildTimeoutBarChart = (data) => {
    const users = getUsers(data)
    const colors = randomColor({hue: 'grey', count: users.length, seed: 100});

    return (
      <div>
        <Header>Timeout bar chart</Header>
        <BarChart width={600} height={600} data={flatten(data)}>
          <XAxis dataKey="name"/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Legend/> {users.map((user, i) => <Bar key={user} dataKey={user} stackId="a" fill={colors[i]}/>)}
        </BarChart>

      </div>
    )
  }

  const buildIndividualPieChart = (data) => {

  }

  return (
    <div>
      <Grid>
        <Grid.Row>
          {buildTimeoutBarChart(data)}
        </Grid.Row>
      </Grid>
    </div>
  )
}
export default TimeoutCharts
