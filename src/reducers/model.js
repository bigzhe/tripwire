// import AttackPattern from '../../server/attackPattern'
import {modelReducer} from '../../util'

const GraphConfig = {
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
      nodes: {},
      links: {},
    }
  }

const sizeOfANode = (s, state) => state.StateView[s].length * 100 + 120
const labelOfANode = (s, state) => s + '\n' + state.StateView[s].join(', ')

const updatedConfigOfNodes = (sArr, state, updateAttrs) => {
  // sArr: s1, s2, moveFrom
  // updateAttrs: {size, sizeOfANode}
  let updatedConfig = {...state.GraphConfig.updatedConfig.nodes}
  // console.log('sArr', sArr)
  sArr.forEach((s) => {
    updatedConfig[s] = updatedConfig[s] || {}
    Object.entries(updateAttrs).forEach(([attr, func]) => {
      updatedConfig[s][attr] = func(s, state)
    })
  })
  return updatedConfig
}

const selectedColor = '#757575'

// #757575 hightlight

const updatedConfigOfLinks = (state) => {

  let updatedConfig = {...state.GraphConfig.updatedConfig.links}
  updatedConfig = {
  }
  return updatedConfig
}

const updatedStateWithConfig = (sArr, state, updateAttrs) => {
  return {
    ...state,
    GraphConfig: {
      ...state.GraphConfig,
      updatedConfig: {
         nodes: updatedConfigOfNodes(
          sArr,
          state,
          updateAttrs
        ),
        links: updatedConfigOfLinks(state),
      }
    }
  }
}

const removeAllHighlight = (links) => {
  const updatedLinks = {...links}
  Object.keys(updatedLinks).forEach(link => {
    delete updatedLinks[link].color
  })
  return updatedLinks
}

const flattenMoves = (moves) => {
  const data = {}
  Object.entries(moves).forEach(([key, ms]) => {
    Object.entries(ms).forEach(([m_key, times]) => {
      data[m_key] = data[m_key] || 0
      data[m_key] += times
    })
  })
  console.log(data)
  return data
}
const scaleValue = (OldMax, OldMin, OldValue) => {
  let NewMin = 1.5, NewMax = 6.0
  let OldRange = (OldMax - OldMin) * 1.0
  if (OldRange === 0)
      return NewMin
  else {
      const NewRange = (NewMax - NewMin)  
      return (((OldValue - OldMin) * NewRange) / OldRange) + NewMin
  }
  // return NewValue
}
const updatedLinkConfig = (data) => {
  const moves = flattenMoves(data)
  let OldMax = 0, OldMin = 0
  Object.entries(moves).forEach(([m, t]) => {
    OldMax = OldMax > t ? OldMax : t
    OldMin = OldMin < t ? OldMin : t
  })

  // special cases
  const result = {}
  Object.keys(moves).forEach(move => {
    result[move] = result[move] || {}
    result[move].strokeWidth = scaleValue(OldMax, OldMin, moves[move])
  })
  return result
}

const model = (state = 'Loading', action) => {
  switch (action.type) {
    case 'INIT_MODEL':
      return {
        ...action.data,
        GraphConfig,
      }
    case 'RESET_MODEL':
      return {
        UserView: {},
        StateView: {},
        GraphConfig,
      }
    case 'USER_MOVE_TO_MULTIPLE':
      const updatedModel = modelReducer(state, {
        type: 'USER_MOVE_TO_MULTIPLE',
        tuple: action.tuple,
        moves: action.moves,
        expired: action.expired
      })

      return {
        ...updatedStateWithConfig(
          // Array.from(new Set([...froms, ...tos])),
          // ['s1', 's2', 's3', 's4', 's5'],
          Object.keys(updatedModel.StateView), 
          updatedModel,
          {
            size: sizeOfANode,
            label: labelOfANode
          }
        ),
        Track: updatedModel.Track
      }

    case 'REFRESH_GRAPHCONFIG':
      return updatedStateWithConfig(
        Object.keys(state.StateView), 
        state, 
        {
          size: sizeOfANode,
          label: labelOfANode
        },
      )
     
    // *****************************
    // Presenting the balabala
    // *****************************
    case 'STATISTIC_GRAPH':
      // console.log(flattenMoves(state.Statistic.moves))
      return {
        ...state,
        UserView: {},
        StateView: {},
        GraphConfig: {
          ...state.GraphConfig,
          updatedConfig: {
            ...state.GraphConfig.updatedConfig,
            links: updatedLinkConfig(state.Statistic.moves)
          }
        }
      }
    case 'HIGHLIGHT_TRACE':
    // case 'SET_OVERVIEW_TRACE':
      // action.trace s0 s1 s2 s3 s4
      const arr = action.trace.split(' ')
      if (arr.length <= 1) return {
        ...state,
        GraphConfig: {
          ...state.GraphConfig,
          updatedConfig: {
            ...state.GraphConfig.updatedConfig,
            links: removeAllHighlight(state.GraphConfig.updatedConfig.links)
          }
        }
      }
      const moves = arr.slice(0, arr.length-1).map((e, i) => [e, arr.slice(1, arr.length)[i]])
      const updatedLinks = removeAllHighlight(state.GraphConfig.updatedConfig.links)

      moves.forEach(move => {
        const key = move.join(' ')
        updatedLinks[key] = updatedLinks[key] || {}
        updatedLinks[key].color = selectedColor
      })
      return {
        ...state,
        GraphConfig: {
          ...state.GraphConfig,
          updatedConfig: {
            ...state.GraphConfig.updatedConfig,
            links: updatedLinks
          }
        }
      }
    case 'CANCEL_HIGHLIGHT':
      return {
        ...state,
        GraphConfig: {
          ...state.GraphConfig,
          updatedConfig: {
            ...state.GraphConfig.updatedConfig,
            links: removeAllHighlight(state.GraphConfig.updatedConfig.links)
          }
        }
      }
    case 'CHANGE_COLOR':
      // action: id, color
      return updatedStateWithConfig(
        [action.id],
        state,
        {
          color: () => action.color
        }
      )
    case 'CHANGE_SIZE':
      // action: id, size
      return updatedStateWithConfig(
        [action.id],
        state,
        {
          size: () => action.size
        }
      )
    case 'UPDATE_LABEL':
      // action: id, label = [user]
      return updatedStateWithConfig(
        [action.id],
        state, 
        {
          label: () => action.label
        },
      )
    case 'CHANGE_SYMBOLTYPE':
      return updatedStateWithConfig(
        [action.id],
        state, 
        {
          symbolType: () => action.symbolType
        },
      )
    default:
      return state
  }
}

export default model
