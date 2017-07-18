import AttackPattern from './attackPattern'

var moment = require('moment');
moment().format();

export const unzipMODEL = (MODEL) => {
  MODEL = MODEL || {}
  const Model = MODEL.Model || []
  const Track = MODEL.Track || {}
  const Statistic = MODEL.Statistic || {}

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
  
  return {UserView, StateView, Track, Statistic}
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
  return {Model: result, Track: MODEL.Track, Statistic: MODEL.Statistic}
}

//
// ─── PARSER ──────────────────────────────────────────────────────────────────────
//
const filterPattern = (pattern, target) => {
  let result = {}
  Object.entries(pattern).forEach(([key, value]) => {
    if (value.pattern === target)
      result[key] = value
  })
  return result
}

export const parseDate = (date) => moment(date, 'DD/MM/YYYY HH:mm')

// get moves
export const parseLog = (model, tuple) => {
  const pattern = AttackPattern.states
  // const initialStates = getIntialStates(pattern)
  // dispatchUserMoveTo(id, moveFrom, moveTo, severalHoursLater(2))
  // let user = id
  let moves = []
  // {id, pc, action, date}
  const {user, device, activity, key_data} = tuple

  const now = key_data.Date

  // the user should always be at s0, so
  if (!model.UserView[user] || model.UserView[user].findIndex(elem => elem.id === 's0') === -1) {
    pattern['s0'].children.forEach(c => {
      if (pattern.s0.canCommit[c](tuple)) {
        moves.push({from: 's0' , to: c})
      }
    })
  }

  const isExpiredMove = (commitTime, moveFrom, moveTo) => {
    // 14/01/2013 10:51
    // return parseDate(now).diff(parseDate(commitTime), 'minutes') > pattern[moveTo].timeout
    return parseDate(now).diff(parseDate(commitTime), 'minutes') > pattern[moveFrom].timeout[moveTo]
  }
  const isExpiredState = (state) => {
    if (pattern[state.id].isOutcome) return false
    // const commitTime = model.UserView[user].find(elem => elem.id === stateId).commitTime
    return pattern[state.id].children.reduce((a,b) => {
      if (!a) return false
      return isExpiredMove(state.commitTime, state.id, b)
    }, true)
  }

  let map = {}

  if (model.UserView[user]) {
    model.UserView[user].forEach((s) => {
      // check whether this is a expired state
      if (isExpiredState(s)) {
        console.log('Expired state:', s.id)
        moves.push({from: s.id, to: 's0'})
      } else {
        pattern[s.id].children.forEach((c) => {
          // can commit
          // TODO: change the canCommit to transition
          if (pattern[s.id].canCommit[c](tuple)  ) {
            // not expired
            // if (!pattern[s.id].timeout[c] || Date.now() - s.commitTime < pattern[s.id].timeout[c]) {
            if (!isExpiredMove(s.commitTime, s.id, c)) {

        // if (s.id === 's1' && c === 's2') {
        //   console.log('------------------------------------');
        //   console.log(now)
        //   console.log(s.commitTime)
        //   // console.log(parseDate(now) - parseDate(s.commitTime));
        //   console.log(pattern[c].timeout)
        //   console.log('------------------------------------');
        // }
              // console.log('not expired')
              // when two moves to the same node
              // parseDate(map[c])
              if (!map[c] || new Date(map[c].commitTime) < new Date(s.commitTime)) { // use the larger (later) commit time
                map[c] = {...s}
                // id
                // commitTime
              }
            } else {
              console.log('Expired!!!!!!!!!!!!!!!');
            }
          }
        })
      }

    })
  }
  // moves.push({from: s.id, to: c, commitTime: Date.now()})
  Object.entries(map).forEach(([k, v]) => {
    moves.push({from: v.id, to: k})
  })

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

export const traceBack = (stateId, userId, Track, pattern) => {
  // console.log('trace back');
  // const pattern = AttackPattern.states
  if (stateId === 's0') return []
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
    // console.log(transitions)
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
      // action.tuple
      // const {user, device, activity, key_data} = tuple
      // action.moves 
      // [{
      //   from: 's1', to: 's3', fromTime
      // }, {
      //   from: 's1', to: 's4', fromTime
      // }, {
      //   from: 's3', to: 's4', fromTime
      // }
      // ]
      // console.log(action)

      const {user, device, activity, key_data} = action.tuple
      const now = key_data.Date
      const moves = action.moves

      // filter the expired moves
      let updatedStateView = {...state.StateView}
      updatedStateView['s0'] = updatedStateView['s0'] || []

      let updatedUserView = []
      if (state.UserView[user]) {
        updatedUserView = [...state.UserView[user]]
      }

      const pattern = AttackPattern.states

      // add/update s0
      const initialIndex = updatedUserView.findIndex(elem => elem.id === 's0')
      if (initialIndex === -1) { // no s0 in the model
        updatedUserView.push({id: 's0', commitTime: now})
        updatedStateView['s0'].push(user)
      } else {
        updatedUserView[initialIndex] = {id: 's0', commitTime: now}
      }

      // update Track
      let Track = {...state.Track}
      Track[user] = Track[user] || {}    
      moves.forEach(move => {
        Track[user][move.from + ' ' + move.to] = now
      })

      // Statistic
      let Statistic = {...state.Statistic}
      // update number of moves
      Statistic.moves = Statistic.moves || {}
      Statistic.traces = Statistic.traces || {}
      Statistic.timeouts = Statistic.timeouts || {}
      moves.forEach(move => {

        if (move.to !== 's0') {
          Statistic.moves[user] = Statistic.moves[user] || {}
          Statistic.moves[user][move.from + ' ' + move.to] = Statistic.moves[user][move.from + ' ' + move.to] || 0
          Statistic.moves[user][move.from + ' ' + move.to]++
        }

        // record the timeout event
        if (move.to === 's0') {
          Statistic.timeouts[user] = Statistic.timeouts[user] || {}
          Statistic.timeouts[user][move.from] = Statistic.timeouts[user][move.from] || 0
          Statistic.timeouts[user][move.from]++
        }

        // record the trace of an attack
        if (pattern[move.to].isOutcome) {
          const trace = traceBack(move.to, user, Track, pattern).join(' ')
          Statistic.traces[trace] = Statistic.traces[trace] || []
          Statistic.traces[trace].push({user, time: now})

          // Statistic.traces[user] = Statistic.traces[user] || {}
          // Statistic.traces[user][traceBack(move.to, user, Track, pattern).join(' ')] = Statistic.traces[user][traceBack(move.to, user, Track, pattern).join(' ')] || 0
          // Statistic.traces[user][traceBack(move.to, user, Track, pattern).join(' ')]++
        }
        
      })
  

      // user view
      const froms = Array.from(new Set(moves.map((m) => m.from).filter((e) => e)));
      const tos = Array.from(new Set(moves.map((m) => m.to)));

      // when the user id is not in the state
      const findTupleByState = (stateId) => {
        return updatedUserView.find(elem => elem.id === stateId)
      }

      // processing the move to s0 moves
      moves.forEach(move => {
        if (move.to === 's0') {
          // deleteSet.push(move.from)
          updatedUserView.splice(updatedUserView.findIndex(tuple => tuple.id === move.from), 1)
          updatedStateView[move.from] = removeState(user, updatedStateView[move.from])
        }
      })

      moves.forEach(move => {
        let targetTuple = findTupleByState(move.to)
        // console.log(targetTuple)
        if (targetTuple) {
          targetTuple.commitTime = now
        } else {
          updatedUserView.push({id: move.to, commitTime: now})
        }
      })
      // update user ivew

      tos.forEach((t) => {
        updatedStateView[t] = insertState(user, updatedStateView[t])
      })

      return {
        ...state,
        UserView: {
          ...state.UserView,
          [user]: updatedUserView,
        },
        StateView: updatedStateView,
        Track,
        Statistic,
      }


    default:
      return state
  }
}

