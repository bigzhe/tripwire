import React from 'react'
import {Container, Button, Header, List, Divider} from 'semantic-ui-react'

const StatePresenter = ({id, users, patterns, Track}) => {
  // console.log(pattern)
  console.table(Track)
  console.clear()
  
  const traceBack = (stateId, userId) => {
    console.clear()
    let result = [stateId]
    const initialTransitions = patterns[stateId].parents.map(parent => Track[userId][parent + ' ' + stateId]).filter(n => n!=undefined)
    if (!initialTransitions.length) {
      return []
    }
    const largest = initialTransitions.reduce((a,b) => {
      return new Date(a) > new Date(b) ? a : b
    })
    // console.log('largest', largest)

    const dfs = (currentNode) => {
      const transitions = patterns[currentNode].parents.map(parent => parent + ' ' + currentNode).filter(n => Track[userId][n] != undefined)
      console.log(transitions)
      if (!transitions.length) 
        return
      else {
        let targetTransition = transitions.reduce((a,b) => {
          if (!a && Track[userId][b] > largest) {
            return undefined
          } else if (!a && Track[userId][b] <= largest) {
            return b
          } else {
            if (Track[userId][a] < Track[userId][b] && Track[userId][b] < largest)  {
              return b
            } else {
              return a
            }
          }

        }, undefined)

        if (targetTransition === undefined) { // all states were updated
          return
        } else {
          const [from, to] = targetTransition.split(' ')
          // console.log('------------------------------------');
          // console.log();
          // console.log(from, to);
          // console.log('------------------------------------');
          
          result.push(from)
          dfs(from)
        }
      }

    }
    dfs(stateId)
    result = result.reverse()
    console.log('result', result)
  } 
  let pattern = patterns[id]

  users = users || []
  return (
    <div>
      
      <Header as="h5">
        Node: {id} 
      </Header>
      Inside users:
      <List bulleted>
        {
          users.map((user) => 
            <List.Item 
              key={user}>
              <a href="#" onClick={() => traceBack(id, user)}>{user}</a>
            </List.Item>
          )
        }
      </List>

      Properties:
      <List bulleted>
        {Object.entries(pattern).map(([k,v])=> 
          <List.Item key={k}>
            {k}: {k === 'timeout' ? 
              Object.entries(v).map(([k2, v2]) => 
                <List.Item key={k2}>{k2}: {v2}</List.Item>
              )
            : 
            v}
          </List.Item>
          )}
      </List>
      
      <Divider />
    </div>
  )
}
export default StatePresenter
