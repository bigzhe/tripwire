import React, { Component } from 'react'
import {Graph} from '../../node_modules/react-d3-graph'
import {severalHoursLater} from '../utils/dateUtils'
import {patternToGraphData, filterPattern} from '../utils/graphicUtils'

import { Button, Header, Dropdown, Form } from 'semantic-ui-react'

class LiveGraph extends Component {

  render() {

    const {
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
    } = this.props

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

    let flag = visibilityFilter === 'pattern2'
    let data = patternToGraphData(filterPattern(attackPattern, visibilityFilter))
    console.log('------------------------------------');
    console.log(data);
    console.log('------------------------------------');

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
            }}/>
        </Form.Field>
        <div style={{
          border: '1px dashed black'
        }}>
        { patternData.map((p) => 
            <div key={p.key} hidden={visibilityFilter !== p.key}>
              <Graph
                id={'live-graph'+p.key}
                data={patternToGraphData(filterPattern(attackPattern, p.key))}
                config={model.GraphConfig}
                onClickNode={onClickNode}
                onScrollPassive={this.onScrollPassive}
              />
            </div>
          )
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