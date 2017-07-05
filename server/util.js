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
          if (!pattern[s.id].timeout[c] || Date.now() - s.commitTime < pattern[s.id].timeout[c]) {
            console.log('not expired')
            // when two moves to the same node
            if (!map[c] || map[c].commitTime < s.commitTime) { // use the larger (later) commit time
              map[c] = {...s}
              // id
              // commitTime
            }
          }
        }
      })
    })
  }
  // moves.push({from: s.id, to: c, commitTime: Date.now()})
  Object.entries(map).forEach(([k, v]) => {
    moves.push({from: v.id, to: k, commitTime: Date.now()})
  })
  initialStates.forEach((c) => {
      if (pattern[c].canCommit(user, action)) {
        moves.push({from: undefined , to: c, commitTime: Date.now()})
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

export const modelReducer = (state, action) => {
  switch (action.type) {
    case 'USER_MOVE_TO_MULTIPLE':
      // action.id
      // action.moves 
      // [{
      //   from: 's1', to: 's3', commitTime
      // }, {
      //   from: 's1', to: 's4', commitTime
      // }, {
      //   from: 's3', to: 's4', commitTime
      // }
      // ]

      // update Track
      const now = new Date()
      let Track = {...state.Track}
      Track[action.id] = Track[action.id] || {}

      // dye the parent nodes with the target value to now
      const dyeNodes = (currentNode, target, now) => {
        if (Track[action.id][currentNode] !== target)
          return
        Track[action.id][currentNode] = now
        const pattern = AttackPattern.states

        pattern[currentNode].parents.forEach(parent => {
          dyeNodes(parent, target, now)
        })
      }
      action.moves.forEach(move => {
        //   from: 's1', to: 's3', commitTime
        Track[action.id][move.to] = now
        if (move.from)
          dyeNodes(move.from, Track[action.id][move.from], now)
      })

      console.log('------------------------------------');
      console.log(Track);
      console.log('------------------------------------');

      // user view
      const froms = Array.from(new Set(action.moves.map((m) => m.from).filter((e) => e)));
      const tos = Array.from(new Set(action.moves.map((m) => m.to)));


      // when the user id is not in the state
      state.UserView[action.id] = state.UserView[action.id] || []

      const updatedUserView = state.UserView[action.id].reduce((total, current) => {
        if (!tos.includes(current.id) && 
            !froms.includes(current.id) ){ // &&
          // new Date() < current.expirationTime ) {
          
          // not expired
          // id is not duplicated
          // moveFrom
          total.push(current)
        }
        return total
      }, action.moves.filter((elem, pos, arr) => pos === arr.findIndex((e) => e.to === elem.to))
          .map((t) => {return {id: t.to, commitTime: t.commitTime}}))

      // state view
      // TODO: consider the expiration time
      let updatedStateView = {...state.StateView}
      // console.log(state.StateView)

      froms.forEach((f) => {
        updatedStateView[f]= removeState(action.id, updatedStateView[f])
      })

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

