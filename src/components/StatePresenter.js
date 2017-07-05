import React from 'react'
import {Container, Button, Header, List, Divider} from 'semantic-ui-react'

const StatePresenter = ({id, users, patterns, Track}) => {
  // console.log(pattern)
  console.table(Track)
  
  const traceBack = (nodeId, userId) => {
    if (Track[userId]['s4'] === Track[userId]['s2']) {
      console.log('hahaha')
    }
    let result = []
    const dfs = (currentNode, trace, target) => {
      console.log(currentNode, trace);
      if (Track[userId][currentNode] !== target) {
        
        result.push(trace)
      } else {
        if (patterns[currentNode].parents.length) {
          patterns[currentNode].parents.forEach(parent => {
            dfs(parent, [...trace, currentNode], target)
          })
        } else {
          result.push([...trace, currentNode])
        }

      }
    }
    dfs(nodeId, [], Track[userId][nodeId])
    console.table(result)
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
