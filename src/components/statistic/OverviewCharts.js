import React from 'react'
import {Grid, Container, Button, Header, List, Divider, Accordion} from 'semantic-ui-react'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

import randomColor from 'randomColor'

const OverviewCharts = ({data, overviewFilter}) => {

  const traces = data.traces

  const getUsers = (traces) => {
    const users = {}
    Object.keys(traces).forEach(key => {
      traces[key].forEach(({user, time}) => {
        if (!users[user]) users[user] = true
      })
    })
    return Object.keys(users)
  }


  const processTraces = (traces) => {
    const result = []
    Object.keys(traces).forEach(key => {
      const tuple = {}
      tuple.name = key
      traces[key].forEach(({user, time}) => {
        tuple[user] = tuple[user] || 0
        tuple[user]++
      })
      result.push(tuple)
    })
    return result
  }

  const processUsers = (users, traces) => {
    return users.map(user => {
      const tuple = {}
      tuple.name = user
      Object.keys(traces).forEach(trace => {
        tuple[trace] = traces[trace].filter(elem => elem.user === user).length
      })
      return tuple
    })
  }
 
  const buildTraceBarChart = (traces) => {
    let users = getUsers(traces)
    let data = processTraces(traces)
    const colors = randomColor({
      seed: 120,
      count: users.length
    });

    return (
      <div>
        <Header>Stacked bar chart</Header>
        <BarChart width={400} height={600} data={data}>
          <XAxis dataKey="name"/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Legend />
            {users.map((user,i) => <Bar key={user} dataKey={user} stackId="a" fill={colors[i]} />)}
        </BarChart>

      </div>
    )
  }

  const buildUserBarChart = (traces) => {
    let users = getUsers(traces)
    let data = processUsers(users, traces)
    const colors = randomColor({
      seed: 50,
      hue: 'grey',
      count: Object.keys(users).length
    });

    return (
      <div>
        <Header>Users bar chart</Header>
        <BarChart width={600} height={300} data={data}>
          <XAxis dataKey="name"/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Legend />
            {Object.keys(traces).map((trace,i) => <Bar key={trace} dataKey={trace} stackId="a" fill={colors[i]} />)}
        </BarChart>

      </div>
    )
  }

  return (
    <div>
      <Grid>
        <Grid.Row>
          {buildTraceBarChart(data.traces)}
        </Grid.Row>
        <Grid.Row>
          {buildUserBarChart(data.traces)}
        </Grid.Row>
      </Grid>
    </div>
  )
}
export default OverviewCharts
