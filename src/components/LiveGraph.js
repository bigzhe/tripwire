import React from 'react'
import {Graph} from '../../node_modules/react-d3-graph'
import {severalHoursLater} from '../utils/dateUtils'

import { Button, Header } from 'semantic-ui-react'

const LiveGraph = ({
  model,
  attackPattern,
  // graphConfig,
  dispatchRefreshGraphConfig,
  dispatchChangeColor,
  dispatchChangeSymbolType,
  dispatchUserMoveTo,
  dispatchUpdateLabel,
  dispatchChangeSize,
  dispatchSetPresentFilter,
}) => {
  let id
  let value

  // Parse Log !!!
  const parseLog = (log) => {
    console.log(log, model, model.graphConfig)
    let id = 'Alice'
    let moveFrom = 's3'
    let moveTo = 's5'
    
    // console.log(model)
    // dispatchRefreshGraphConfig()
    dispatchUserMoveTo(id, moveFrom, moveTo, severalHoursLater(2))
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

// <Button onClick={() => parseLog('abc')}>ParseLog</Button>
  return (
    <div>
      
      <Header >
        Graph
        <Header.Subheader>
          Current rendering patter: Attack pattern tree 1
        </Header.Subheader>
      </Header>
      <div style={{
        border: '1px dashed black'
      }}>
        <Graph
          id='live-graph'
          data={attackPattern.patternToGraphData(attackPattern.pattern1)}
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