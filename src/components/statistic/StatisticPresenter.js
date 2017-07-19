import React from 'react'
import {Divider, Container, List, Header, Menu} from 'semantic-ui-react'
import UserPresenter from '../UserPresenter'
import StatePresenter from '../StatePresenter'
import OverviewPresenter from './OverviewPresenter'

// const StatisticPresenter = ({model, presentFilter, dispatchSetPresentFilter, attackPattern}) => {
class StatisticPresenter extends React.Component {
  render() {

    const {model, overviewFilter, presentFilter, dispatchSetPresentFilter, attackPattern, dispatchSetOverviewTrace} = this.props
    let id, users
    if (presentFilter.showType === 'StateView') {
      id = presentFilter.id
      users = model.StateView[presentFilter.id]
    }

    let presenter = null
    if (model === 'Loading' || attackPattern === 'Loading') {
      presenter = <Header>Loading</Header>
    } else {
      switch (presentFilter.showType) {
        case 'Trace':
          presenter = <OverviewPresenter {...{model, overviewFilter, dispatchSetOverviewTrace}}/>
          break
        case 'UserView':
          presenter = (
            <Container>
              {
                Object.entries(model.UserView).map(([user,positions]) => 
                  <UserPresenter key={user} {...{user,positions}} />
                )
              }
            </Container>
          )
          break
        case 'StateView':
          presenter = (
            <Container>
              <StatePresenter key={id} {...{id,users,patterns: attackPattern.states, Track: model.Track}} />
            </Container>
          )
        default:
          break;
      }
      
    }

    return (
      <Container fluid>
        <Header >
          Statistic interface for pattern 1
          <Header.Subheader>
            Time: {'' + new Date()}
          </Header.Subheader>
        </Header>
        <Menu tabular>
          <Menu.Item name='Trace' active={presentFilter.showType === 'Trace'} onClick={() => dispatchSetPresentFilter('Trace')} />
          <Menu.Item name='Transition' active={presentFilter.showType === 'Transition'} onClick={() => dispatchSetPresentFilter('Transition')} />
          <Menu.Item name='User' active={presentFilter.showType === 'UserView'} onClick={() => dispatchSetPresentFilter('UserView')} />
          <Menu.Item name='State' active={presentFilter.showType === 'StateView'} onClick={() => dispatchSetPresentFilter('StateView')} />
        </Menu>
      
        {presenter}
      </Container>
    )
  }

}
export default StatisticPresenter
