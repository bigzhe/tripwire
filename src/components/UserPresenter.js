import React from 'react'
import {Container, Button, Header, List, Divider} from 'semantic-ui-react'

const UserPresenter = ({user, positions}) => {
  return (
    <div>
      
      <Header as="h5">{user}</Header>
      <List bulleted>
        {
          positions.map(({id, commitTime}) => 
            <List.Item 
              key={id} 
              style={{
                color: id === 's5' && 'red'
              }}>Located in {id}, commited at {'' + commitTime}</List.Item>
          )
        }
      </List>
      <Divider />
      
    </div>
  )
}
export default UserPresenter
