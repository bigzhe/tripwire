import React from 'react'
import {Container, Button, Header, List, Divider} from 'semantic-ui-react'

const StatePresenter = ({id, users, pattern}) => {
  // console.log(pattern)
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
            {k}: {v}
          </List.Item>
          )}
      </List>
      
      <Divider />
    </div>
  )
}
export default StatePresenter
