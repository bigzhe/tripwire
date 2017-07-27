import React, { Component } from 'react'
import {Graph} from '../../node_modules/react-d3-graph'
import {severalHoursLater} from '../utils/dateUtils'
import {patternToGraphData, filterPattern} from '../utils/graphicUtils'

import { Redirect } from 'react-router-dom'

import { Button, Header, Dropdown, Form } from 'semantic-ui-react'

class LiveGraph extends Component {

  render() {

    const {
      model,
      attackPattern,
      visibilityFilter,
      // graphConfig,
      history,
      dispatchRefreshGraphConfig,
      dispatchChangeColor,
      dispatchChangeSymbolType,
      dispatchUserMoveTo,
      dispatchUserMoveToMultiple,
      dispatchUpdateLabel,
      dispatchChangeSize,
      dispatchSetPresentFilter,
      dispatchSetVisibilityFilter,
    } = this.props

    // Graph event callbacks
    const onClickNode = function (nodeId) {
      dispatchSetPresentFilter('StateView', nodeId)
    };

    const patternData = []
    if (attackPattern !== 'Loading') {
      attackPattern.info.patterns.forEach(p => {
        patternData.push({
          key: p,
          value: p,
          text: p
        })
      })
    }
    
    return (
      <div>
       
        <Header >
          Graph
          <Header.Subheader>
            Current rendering patter
          </Header.Subheader>
        </Header>
        <Form.Field>
            <Dropdown
              placeholder='Select actions'
              search
              selection
              options={patternData}
              value={visibilityFilter}
              onChange={(e, p) => {
                history.push(p.value)
                history.go(p.value)
                console.log(p.value)
                console.log(history)
              }}/>
        </Form.Field>
        <br/>
        <div style={{
          border: '1px dashed black'
        }}>
        { 
          (model !== 'Loading' && attackPattern !== 'Loading') ?
                <Graph
                  id='live-graph'
                  data={patternToGraphData(filterPattern(attackPattern.states, visibilityFilter))}
                  config={model.GraphConfig}
                  onClickNode={onClickNode}
                  onScrollPassive={this.onScrollPassive}
                />

          :
          <Header>Loading</Header>
        }
        </div>
      </div>
    )
  }
}

const LiveGraph2 = ({
  model,
  attackPattern,
  visibilityFilter,
  // graphConfig,
  dispatchRefreshGraphConfig,
  dispatchChangeColor,
  dispatchChangeSymbolType,
  dispatchUserMoveTo,
  dispatchUserMoveToMultiple,
  dispatchUpdateLabel,
  dispatchChangeSize,
  dispatchSetPresentFilter,
  dispatchSetVisibilityFilter,
}) => {

  // Parse Log !!!
  const generateMoveAction = (log) => {
        let moves = [{
        from: 's1', to: 's3', expirationTime: severalHoursLater(1)
      }, {
        from: 's1', to: 's4', expirationTime: severalHoursLater(1)
      }, {
        from: 's3', to: 's4', expirationTime: severalHoursLater(1)
      }
      ]
    let id = 'Someone'
    // let moveFrom = 's3'
    // let moveFrom = undefined
    // let moveTo = 's1'
    
    // console.log(model)
    // dispatchRefreshGraphConfig()
    dispatchUserMoveToMultiple(id, moves)
  }
  // 


  // Graph event callbacks
  const onClickNode = function (nodeId) {
    // console.log('Clicked node', nodeId);
    // dispatchChangeColor(nodeId, 'black');
    // console.log('------------------------------------');
    // console.log(nodeId);
    // console.log('------------------------------------');
    dispatchSetPresentFilter('StateView', nodeId)
  };

  const patternData = [1,2,3].map((k) => {
    return {
      key: 'pattern' + k,
      value: 'pattern'+k,
      text: 'pattern ' + k
    }
  })
// data={attackPattern.patternToGraphData(attackPattern.pattern1)}
// <Button onClick={() => parseLog('abc')}>ParseLog</Button>
  return (
    <div>
      
      <Header >
        Graph
        <Header.Subheader>
          Current rendering patter: {visibilityFilter}
        </Header.Subheader>
      </Header>
      <Form.Field>
          <Dropdown
            placeholder='Select actions'
            search
            selection
            options={patternData}
            value={visibilityFilter}
            onChange={(e, p) => {
              console.log(p.value)
              dispatchSetVisibilityFilter(p.value)
              forceUpdate()
          }}/>
      </Form.Field>
      <div style={{
        border: '1px dashed black'
      }}>
        <Graph
          id='live-graph'
          data={patternToGraphData(filterPattern(attackPattern, visibilityFilter))}
          config={model.GraphConfig}
          onClickNode={onClickNode}
        />
      </div>
    </div>
  )
}
export default LiveGraph

// style
const styles = {
  graph: 'border: 1px dashed black;'
}