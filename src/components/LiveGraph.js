import React from 'react'
import {Graph} from '../../node_modules/react-d3-graph'
import {severalHoursLater} from '../utils/dateUtils'
import {patternToGraphData, filterPattern} from '../utils/graphicUtils'

import { Button, Header, Dropdown, Form } from 'semantic-ui-react'

const LiveGraph = ({
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
  let id
  let value

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
              generateMoveAction()
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