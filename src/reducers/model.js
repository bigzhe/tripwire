import AttackPattern from '../../server/attackPattern'
import {modelReducer} from '../../server/util'

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

    }
  }

const sizeOfANode = (s, state) => state.StateView[s].length * 100 + 120
const labelOfANode = (s, state) => s + '\n' + state.StateView[s].join(', ')

const updatedConfigOfNodes = (sArr, state, updateAttrs) => {
  // sArr: s1, s2, moveFrom
  // updateAttrs: {size, sizeOfANode}
  let updatedConfig = {...state.GraphConfig.updatedConfig}
  console.log('sArr', sArr)
  sArr.forEach((s) => {
    updatedConfig[s] = updatedConfig[s] || {}
    Object.entries(updateAttrs).forEach(([attr, func]) => {
      updatedConfig[s][attr] = func(s, state)
    })
  })
  return updatedConfig
}

const updatedStateWithConfig = (sArr, state, updateAttrs) => {
  return {
    ...state,
    GraphConfig: {
      ...state.GraphConfig,
      updatedConfig: updatedConfigOfNodes(
        sArr,
        state,
        updateAttrs
      )
    }
  }
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
        moves: action.moves
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
