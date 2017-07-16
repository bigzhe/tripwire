import AttackPattern from '../../server/attackPattern'
import until from '../../server/util'

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

const removeState = (id, arr) => {
  if (!arr) return arr
  else return arr.filter((a)=>a!==id)
}

// without duplication
const insertState = (id, arr) => {
  arr = arr || []
  if (arr.includes(id)) {
    return arr;
  } else {
    return [...arr, id]
  }
}

 export const traceBack = (stateId, userId, Track) => {
  const pattern = AttackPattern.states
  let result = [stateId]
  const initialTransitions = pattern[stateId].parents.map(parent => Track[userId][parent + ' ' + stateId]).filter(n => n!=undefined)
  if (!initialTransitions.length) {
    return result
  }
  const largest = initialTransitions.reduce((a,b) => {
    return new Date(a) > new Date(b) ? a : b
  })
  // console.log('largest', largest)

  const dfs = (currentNode) => {
    const transitions = pattern[currentNode].parents.map(parent => parent + ' ' + currentNode).filter(n => Track[userId][n] != undefined)
    console.log(transitions)
    if (!transitions.length) 
      return
    else {
      let targetTransition = transitions.reduce((a,b) => {
        if (!a && Track[userId][b] > largest) {
          return undefined
        } else if (!a && Track[userId][b] <= largest) {
          return b
        } else {
          if (Track[userId][a] < Track[userId][b] && Track[userId][b] < largest)  {
            return b
          } else {
            return a
          }
        }

      }, undefined)

      if (targetTransition === undefined) { // all states were updated
        return
      } else {
        const [from, to] = targetTransition.split(' ')
        // console.log('------------------------------------');
        // console.log();
        // console.log(from, to);
        // console.log('------------------------------------');
        
        result.push(from)
        dfs(from)
      }
    }

  }
  dfs(stateId)
  result = result.reverse()
  console.log('result', result)
  return result
} 

const model = (state = 'Loading', action) => {
  switch (action.type) {
    case 'INIT_MODEL':
      return {
        ...action.data,
        GraphConfig,
      }
    case 'USER_MOVE_TO_MULTIPLE':
      // action.id
      // action.moves 
      // [{
      //   from: 's1', to: 's3', expirationTime
      // }, {
      //   from: 's1', to: 's4'
      // }, {
      //   from: 's3', to: 's4'
      // }
      // ]

      // filter the expired moves
      let updatedStateView = {...state.StateView}
      updatedStateView['s0'] = updatedStateView['s0'] || []

      let updatedUserView = []
      if (state.UserView[action.id]) {
        updatedUserView = [...state.UserView[action.id]]
      }



      const pattern = AttackPattern.states

      // add/update s0
      const initialIndex = updatedUserView.findIndex(elem => elem.id === 's0')
      if (initialIndex === -1) { // no s0 in the model
        updatedUserView.push({id: 's0', commitTime: new Date()})
        updatedStateView['s0'].push(action.id)
      } else {
        updatedUserView[initialIndex] = {id: 's0', commitTime: new Date()}
      }



      const isExpiredMove = (commitTime, moveTo) => {
        return new Date() - new Date(commitTime) > pattern[moveTo].timeout
      }

      const isExpiredTuple = (stateId) => {
        const commitTime = updatedUserView.find(elem => elem.id === stateId).commitTime
        return pattern[stateId].children.reduce((a,b) => {
          if (!a) return false
          return isExpiredMove(commitTime, b)
        }, true)
      }

      // update Track
      let Track = {...state.Track}
      Track[action.id] = Track[action.id] || {}

      const moves = []
      action.moves.forEach(move => {
        // const pattern = AttackPattern.states
        // if (isExpiredMove(move.fromTime, move.to)) { // expired
        if (false) {
        // if (new Date() - new Date(move.fromTime) > pattern[move.to].timeout) { // expired
          console.log('expired')
          // TODO: handle the expired -- dfs to delete expired nodes
          const trace = traceBack(move.from, action.id, Track)
          
          trace.forEach(s => {
            if (isExpiredTuple(s)) {
              console.log('delete', s, 'index', updatedUserView.findIndex(elem=>elem.id===s))
              // remove the elem with an id equals to s
              updatedUserView.splice(
                updatedUserView.findIndex(elem=>elem.id===s), 
                1
              )
              updatedStateView[s]= removeState(action.id, updatedStateView[s])
              // console.log('problem', updatedUserView);
            }

          })
          
        } else {
          moves.push(move)
          Track[action.id][move.from + ' ' + move.to] = new Date()
        }
      })
      console.log(updatedUserView);

      // user view
      const froms = Array.from(new Set(moves.map((m) => m.from).filter((e) => e)));
      const tos = Array.from(new Set(moves.map((m) => m.to)));

      // when the user id is not in the state

      const findTupleByState = (stateId) => {
        return updatedUserView.find(elem => elem.id === stateId)
      }
      
      moves.forEach(move => {
        let targetTuple = findTupleByState(move.to)
        console.log(targetTuple)
        if (targetTuple) {
          targetTuple.commitTime = new Date()
        } else {
          updatedUserView.push({id: move.to, commitTime: new Date()})
        }
      })

      // const updatedUserView = state.UserView[action.id].reduce((total, current) => {
      //   if (!tos.includes(current.id) && 
      //       !froms.includes(current.id) &&
      //       true ){
      //     // new Date() < current.expirationTime ) {
      //     // not expired
      //     // id is not duplicated
      //     // moveFrom
      //     total.push(current)
      //   }
      //   return total
      // }, moves.filter((elem, pos, arr) => pos === arr.findIndex((e) => e.to === elem.to))
      //     .map((t) => {return {id: t.to, commitTime: t.commitTime}}))

      // state view
      // let updatedStateView = {...state.StateView}
      // console.log(state.StateView)

      // froms.forEach((f) => {
      //   updatedStateView[f]= removeState(action.id, updatedStateView[f])
      // })

      tos.forEach((t) => {
        updatedStateView[t] = insertState(action.id, updatedStateView[t])
      })
      
      const updatedModel = {
        ...state,
        UserView: {
          ...state.UserView,
          [action.id]: updatedUserView,
        },
        StateView: updatedStateView,
      }

      return {
        ...updatedStateWithConfig(
          // Array.from(new Set([...froms, ...tos])),
          // ['s1', 's2', 's3', 's4', 's5'],
          Object.keys(updatedStateView), 
          updatedModel,
          {
            size: sizeOfANode,
            label: labelOfANode
          }
        ),
        Track
      }

    case 'USER_MOVE_TO':    
      // action.id - user id
      // action.moveFrom
      // action.moveTo

      // update UserView
      let targetUser = [
        ...state.UserView[action.id]
      ]

      const updatedUser = targetUser.reduce((total, current) => {
        
        if (current.id !== action.moveTo && 
          current.id !== action.moveFrom &&
          new Date() < current.expirationTime ) {
          // not expired
          // id is not duplicated
          // moveFrom
          total.push(current)
        }
        return total
      }, [{id: action.moveTo, expirationTime: action.expirationTime}])

      // insert Userview and update StateView

      const updatedState = {
        ...state,
        UserView: {
          ...state.UserView,
          [action.id]: updatedUser,
        },
        StateView: {
          ...state.StateView,
          [action.moveFrom]: removeState(action.id, state.StateView[action.moveFrom]),
          [action.moveTo]: insertState(action.id, state.StateView[action.moveTo]),
        },
        
      }

      // then we do the statistic and update the graphConfig

      return updatedStateWithConfig(
        [action.moveFrom, action.moveTo],
        updatedState,
        {
          size: sizeOfANode,
          label: labelOfANode
        }
      )
    
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
