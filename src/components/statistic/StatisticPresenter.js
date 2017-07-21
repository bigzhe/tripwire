import React from 'react'
import {Divider, Container, List, Header, Menu} from 'semantic-ui-react'
import OverviewPresenter from './OverviewPresenter'
import TransitionPresenter from './TransitionPresenter'
import TimeoutPresenter from './TimeoutPresenter'
import UserPresenter from './UserPresenter'

class StatisticPresenter extends React.Component {
  render() {

const {
    model,
    overviewFilter,
    presentFilter,
    dispatchSetOverviewFilter,
    attackPattern,
    dispatchSetOverviewTrace,
    dispatchSetOverviewTransition,
    dispatchSetOverviewTimeout,
    dispatchSetOverviewUser,
    dispatchHighlightTrace, 
  } = this.props
  let id,
    users
    if (overviewFilter.showType === 'StateView') {
      id = overviewFilter.id
      users = model.StateView[overviewFilter.id]
    }

    let presenter = null
    if (model === 'Loading' || attackPattern === 'Loading') {
      presenter = <Header>Loading</Header>
    } else {
      switch (overviewFilter.showType) {
        case 'TraceView':
          presenter = <OverviewPresenter {...{model, overviewFilter, dispatchSetOverviewTrace, dispatchHighlightTrace}}/>
          break
        case 'TransitionView':
          presenter = <TransitionPresenter {...{model, overviewFilter, dispatchSetOverviewTransition, dispatchHighlightTrace}}/>
          break
        case 'TimeoutView':
          presenter = <TimeoutPresenter {...{model, overviewFilter, dispatchSetOverviewTimeout, dispatchHighlightTrace}}/>
          break
        case 'UserView':
          presenter = <UserPresenter {...{model, overviewFilter, dispatchSetOverviewUser}}/>
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

    const handleClick = (filter) => {
      dispatchSetOverviewFilter(filter)
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
          <Menu.Item name='Trace' active={overviewFilter.showType === 'TraceView'} onClick={() => dispatchSetOverviewFilter('TraceView')} />
          <Menu.Item name='Transition' active={overviewFilter.showType === 'TransitionView'} onClick={() => dispatchSetOverviewFilter('TransitionView')} />
          <Menu.Item name='Timeout' active={overviewFilter.showType === 'TimeoutView'} onClick={() => dispatchSetOverviewFilter('TimeoutView')} />
          <Menu.Item name='User' active={overviewFilter.showType === 'UserView'} onClick={() => dispatchSetOverviewFilter('UserView')} />
          <Menu.Item name='State' active={overviewFilter.showType === 'StateView'} onClick={() => dispatchSetOverviewFilter('StateView')} />
        </Menu>
      
        {presenter}
      </Container>
    )
  }

}
export default StatisticPresenter
