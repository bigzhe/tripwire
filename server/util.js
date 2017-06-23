import AttackPattern from './attackPattern'
// export const stringToDate = (str) => {
//   DateFormat df = new SimpleDateFormat("mm/dd/yyyy");
// }
const insertWithDefault = (array, elem) => {
  array = array || []
  array.push(elem)
}

export const unzipMODEL = (MODEL) => {
  MODEL = MODEL || []

  let UserView = {}, StateView = {}
  MODEL.forEach(({user_id, state_id, expiration_time}) => {
    // update UserView
    UserView[user_id] = UserView[user_id] || []
    UserView[user_id].push({
      id: state_id,
      expirationTime: expiration_time
    })

    // update StateView
    StateView[state_id] = StateView[state_id] || []
    StateView[state_id].push(user_id)
  })

  return {UserView, StateView}
}

export const zipMODEL = (MODEL) => {
  if (!MODEL)
    return []
  let result = []
  Object.entries(MODEL.UserView).forEach(([id, arr]) => {
    arr.forEach(a => {
      result.push({
        user_id: id,
        state_id: a.id,
        ...a,
      })
    })
  })
  return result
}


//
// ─── PASER ──────────────────────────────────────────────────────────────────────
//
// TODO: get all initial states
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
  const initialStates = getIntialStates(AttackPattern)
  // dispatchUserMoveTo(id, moveFrom, moveTo, severalHoursLater(2))
  let user = id
  let moves = []

  if (model.UserView[user]) {
    model.UserView[user].forEach((s) => {
      AttackPattern[s.id].children.forEach((c) => {
        if (AttackPattern[c].canCommit(user, action)) {          
          moves.push({from: s.id, to: c, expirationTime: Date.now()})
        }
      })
    })
  }
  initialStates.forEach((c) => {
      if (AttackPattern[c].canCommit(user, action)) {
        moves.push({from: undefined , to: c, expirationTime: Date.now()})
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
      //   from: 's1', to: 's3', expirationTime
      // }, {
      //   from: 's1', to: 's4'
      // }, {
      //   from: 's3', to: 's4'
      // }
      // ]

      // user view
      const froms = Array.from(new Set(action.moves.map((m) => m.from).filter((e) => e)));
      const tos = Array.from(new Set(action.moves.map((m) => m.to)));

      // when the user id is not in the state
      state.UserView[action.id] = state.UserView[action.id] || []

      const updatedUserView = state.UserView[action.id].reduce((total, current) => {
        if (!tos.includes(current.id) && 
            !froms.includes(current.id) &&
          new Date() < current.expirationTime ) {
          // not expired
          // id is not duplicated
          // moveFrom
          total.push(current)
        }
        return total
      }, action.moves.filter((elem, pos, arr) => pos === arr.findIndex((e) => e.to === elem.to))
          .map((t) => {return {id: t.to, expirationTime: t.expirationTime}}))

      // state view
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

    default:
      return state
  }
}

