import AttackPattern from './attackPattern'
// export const stringToDate = (str) => {
//   DateFormat df = new SimpleDateFormat("mm/dd/yyyy");
// }
const insertWithDefault = (array, elem) => {
  array = array || []
  array.push(elem)
}

export const unzipMODEL = (MODEL) => {
  MODEL = MODEL || {}
  const Model = MODEL.Model || []
  const Track = MODEL.Track || {}

  let UserView = {}, StateView = {}
  Model.forEach(({user_id, state_id, commitTime}) => {
    // update UserView
    UserView[user_id] = UserView[user_id] || []
    UserView[user_id].push({
      id: state_id,
      commitTime: commitTime
    })

    // update StateView
    StateView[state_id] = StateView[state_id] || []
    StateView[state_id].push(user_id)
  })
  
  return {UserView, StateView, Track}
}

export const zipMODEL = (MODEL) => {
  if (!MODEL)
    return {}
  let result = []
  const Model = MODEL.UserView || []
  Object.entries(Model).forEach(([id, arr]) => {
    arr.forEach(a => {
      result.push({
        user_id: id,
        state_id: a.id,
        ...a,
      })
    })
  })
  return {Model: result, Track: MODEL.Track}
}


//
// ─── PASER ──────────────────────────────────────────────────────────────────────
//
// get all initial states
const getIntialStates = (pattern) => {
  let result = []
  Object.entries(pattern).forEach(([key, value]) => {
    if (value.isInitial)
      result.push(key)
  })
  return result
}

const filterPattern = (pattern, target) => {
  let result = {}
  Object.entries(pattern).forEach(([key, value]) => {
    if (value.pattern === target)
      result[key] = value
  })
  return result
}

export const parseLog = (model, {id, pc, action, date}) => {
  const pattern = AttackPattern.states
  const initialStates = getIntialStates(pattern)
  // dispatchUserMoveTo(id, moveFrom, moveTo, severalHoursLater(2))
  let user = id
  let moves = []

  let map = {}
  // TODO: consider the expiration time here

  if (model.UserView[user]) {
    model.UserView[user].forEach((s) => {
      pattern[s.id].children.forEach((c) => {
        // can commit
        if (pattern[c].canCommit(user, action)  ) {
          // not expired
          // if (!pattern[s.id].timeout[c] || Date.now() - s.commitTime < pattern[s.id].timeout[c]) {
            // console.log('not expired')
            // when two moves to the same node
            if (!map[c] || new Date(map[c].commitTime) < new Date(s.commitTime)) { // use the larger (later) commit time
              map[c] = {...s}
              // id
              // commitTime
            }
          // }
        }
      })
    })
  }
  // moves.push({from: s.id, to: c, commitTime: Date.now()})
  Object.entries(map).forEach(([k, v]) => {
    moves.push({from: v.id, to: k, fromTime: v.commitTime})
  })
  initialStates.forEach((c) => {
      if (pattern[c].canCommit(user, action)) {
        moves.push({from: undefined , to: c, fromTime: 0})
      }
  })
  // add moves to the initial states
  // moves = [{to: 's1'}]
  // dispatchUserMoveToMultiple(user, moves)

  return moves

}

//
// ─── REDUCER ────────────────────────────────────────────────────────────────────
//

  
const sizeOfANode = (s, state) => state.StateView[s].length * 100 + 120
const labelOfANode = (s, state) => s + '\n' + state.StateView[s].join(', ')

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

export const modelReducer = (state, action) => {
  switch (action.type) {
    case 'USER_MOVE_TO_MULTIPLE':
      // action.id
      // action.moves 
      // [{
      //   from: 's1', to: 's3', fromTime
      // }, {
      //   from: 's1', to: 's4', fromTime
      // }, {
      //   from: 's3', to: 's4', fromTime
      // }
      // ]

      // filter the expired moves
      state.UserView[action.id] = state.UserView[action.id] || []
      let updatedUserView = [...state.UserView[action.id]]
      let updatedStateView = {...state.StateView}
      const pattern = AttackPattern.states

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
        if (isExpiredMove(move.fromTime, move.to)) { // expired
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
      // state.UserView[action.id] = state.UserView[action.id] || []
      // const updatedUserView = [...state.UserView[action.id]]

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
      // update user ivew

      // const updatedUserView = state.UserView[action.id].reduce((total, current) => {
      //   if (!tos.includes(current.id) && 
      //       !froms.includes(current.id) ){ // &&
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
      // TODO: consider the expiration time
      // let updatedStateView = {...state.StateView}
      // console.log(state.StateView)

      // froms.forEach((f) => {
      //   updatedStateView[f]= removeState(action.id, updatedStateView[f])
      // })

      tos.forEach((t) => {
        updatedStateView[t] = insertState(action.id, updatedStateView[t])
      })



      
      return {
        ...state,
        UserView: {
          ...state.UserView,
          [action.id]: updatedUserView,
        },
        StateView: updatedStateView,
        Track,
      }


    default:
      return state
  }
}

