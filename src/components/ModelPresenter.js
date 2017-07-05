import React from 'react'
import {Divider, Container, List, Header, Menu} from 'semantic-ui-react'
import UserPresenter from './UserPresenter'
import StatePresenter from './StatePresenter'

const ModelPresenter = ({model, presentFilter, dispatchSetPresentFilter, attackPattern}) => {
  let id, users
  if (presentFilter.showType === 'StateView') {
    id = presentFilter.id
    users = model.StateView[presentFilter.id]
  }
    
  
  console.log('------------------------------------');
  if (id)
    console.log(attackPattern.states[id]);
  console.log('------------------------------------');
  return (
    <Container>
      <Header >
        Model Presenter
      </Header>
      <Menu tabular>
        <Menu.Item name='User' active={presentFilter.showType === 'UserView'} onClick={() => dispatchSetPresentFilter('UserView')} />
        <Menu.Item name='Node' active={presentFilter.showType === 'StateView'} onClick={() => dispatchSetPresentFilter('StateView')} />
      </Menu>

      {
      (model !== 'Loading' && attackPattern !== 'Loading') ?
        presentFilter.showType === 'UserView' ?
          <Container>
            {
              Object.entries(model.UserView).map(([user,positions]) => 
                <UserPresenter key={user} {...{user,positions}} />
              )
            }
          </Container>
        :
          <Container>
            <StatePresenter key={id} {...{id,users,patterns: attackPattern.states, Track: model.Track}} />
          </Container>
        
        :
        <Header>Loading</Header>
      }
    </Container>
  )
}
export default ModelPresenter
