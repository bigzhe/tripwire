const initialState = {
    width: 500,
    height: 800,
    automaticRearrangeAfterDropNode: true,
    // staticGraph: true,
    highlightBehavior: true,
    highlightOpacity: 0.25,
    node: {
      color: 'lightgreen',
      size: 120,
      // highlightStrokeColor: 'blue'
    },
    link: {
      // highlightColor: 'lightblue'
    },
    updatedConfig: {
      Alice: {
        color: 'yellow',
        size: '500',
      }
    }
  };

const graphConfig = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_COLOR':
      // action: id, color
      let updatedConfig = {...state.updatedConfig}
      updatedConfig[action.id] = updatedConfig[action.id] || {}
      updatedConfig[action.id].color = action.color
      return {
        ...state,
        updatedConfig
      }
    case 'CHANGE_SIZE':
      // action: id, size
      updatedConfig = {...state.updatedConfig}
      updatedConfig[action.id] = updatedConfig[action.id] || {}
      updatedConfig[action.id].size = action.size
      return {
        ...state,
        updatedConfig
      }
    case 'UPDATE_LABEL':
      // action: id, label = [user]
      updatedConfig = {...state.updatedConfig}
      updatedConfig[action.id] = updatedConfig[action.id] || {}
      updatedConfig[action.id].label = action.label
      return {
        ...state,
        updatedConfig
      }
    case 'CHANGE_SYMBOLTYPE':
      updatedConfig = {...state.updatedConfig}
        updatedConfig[action.id] = updatedConfig[action.id] || {}
        updatedConfig[action.id].symbolType = action.symbolType
      return {
        ...state,
        updatedConfig
      }
    default:
      return state
  }
  
}

export default graphConfig

    // return {
    //     className: _const2.default.NODE_CLASS_NAME,
    //     cursor: targetUpdatedConfig.mouseCursor || config.node.mouseCursor,
    //     cx: node && node.x || '0',
    //     cy: node && node.y || '0',
    //     fill: targetUpdatedConfig.color || fill,
    //     fontSize: node.highlighted ? (targetUpdatedConfig.highlightFontSize || config.node.highlightFontSize) : (targetUpdatedConfig.fontSize || config.node.fontSize),
    //     fontWeight: node.highlighted ? config.node.highlightFontWeight : config.node.fontWeight,
    //     id: node.id,
    //     label: targetUpdatedConfig.label || node.id,
    //     onClickNode: nodeCallbacks.onClickNode,
    //     onMouseOverNode: nodeCallbacks.onMouseOverNode,
    //     onMouseOut: nodeCallbacks.onMouseOut,
    //     opacity: targetUpdatedConfig.opacity || opacity,
    //     renderLabel: targetUpdatedConfig.renderLabel || config.node.renderLabel,
    //     size: targetUpdatedConfig.size || config.node.size,
    //     stroke: targetUpdatedConfig.stroke || stroke,
    //     strokeWidth: node.highlighted ? (targetUpdatedConfig.highlightStrokeWidth || config.node.highlightStrokeWidth) : (targetUpdatedConfig.highlightStrokeWidth || config.node.strokeWidth),
    //     type: targetUpdatedConfig.symbolType || config.node.symbolType
    // };