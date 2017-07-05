import React from 'react'
import {Container, Button, Header, List, Divider} from 'semantic-ui-react'

const StatePresenter = ({id, users, patterns}) => {
  // console.log(pattern)
  const traceBack = (id) => {

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
              {user}
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
