import React from 'react'
import {Container, Button, Header, List, Divider} from 'semantic-ui-react'

import {traceBack} from '../../util'

const StatePresenter = ({id, users, patterns, Track}) => {
  // console.log(pattern)
  // console.table(Track)
  console.clear()

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
              {user}'s trace: {traceBack(id, user, Track, patterns).join('->')}
            </List.Item>
          )
        }
      </List>

      Properties:
      <List bulleted>
        {Object.entries(pattern).map(([k,v])=> 
          <List.Item key={k}>
            {k}: {k === 'canCommit' || k === 'timeout' ? 
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
