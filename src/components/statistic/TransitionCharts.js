import React from 'react'
import {Grid, Container, Button, Header, List, Divider, Accordion} from 'semantic-ui-react'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

import randomColor from 'randomColor'

const TransitionCharts = ({data, overviewFilter}) => {

  const flatten = (transitions) => {
    const result = []
    Object.entries(transitions).forEach(([transition, arr]) => {
      const tuple = {}
      tuple.name = transition
      arr.forEach(({user, times}) => {
        tuple[user] = times
      })
      result.push(tuple)
    })
    return result
  }
  const getUsers = (transitions) => {
    const users = {}
    Object.keys(transitions).forEach(key => {
      transitions[key].forEach(({user, time}) => {
        if (!users[user]) users[user] = true
      })
    })
    return Object.keys(users)
  }

// name: s1->s2, user1: 10, user2: 20
  const buildTransitionBarChart = (data) => {
    const users = getUsers(data)
    const colors = randomColor({
      hue: 'grey',
      count: users.length,
      seed: 100
    });

    console.log(data)
    console.log(flatten(data))

    return (
      <div>
        <Header>Transition bar chart</Header>
        <BarChart width={600} height={600} data={flatten(data)}>
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

  return (
    <div>
      <Grid>
        <Grid.Row>
          {buildTransitionBarChart(data)}
        </Grid.Row>
      </Grid>
    </div>
  )
}
export default TransitionCharts
