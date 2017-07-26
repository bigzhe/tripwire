// import AttackPattern from './attackPattern'
import AttackPattern from './server/attackPattern.json'

export const canCommitGenerator = (trigger) => {
  return ({user, device, date, activity, color}) => {

    if (trigger.username) {
      const re = new RegExp(trigger.username_regex)
      if (re.exec(user) === null) return false
    }

    if (trigger.pc) {
      const re = new RegExp(trigger.pc_regex)
      if (re.exec(device) === null) return false
    }

    if (trigger.activity) {
      const re = new RegExp(trigger.activity_regex)
      if (re.exec(activity) === null) return false
    }

    if (trigger.color) {
      if (color.toLowerCase() !== trigger.color_regex.toLowerCase())
        return false
    }

    if (trigger.timeRange) {
      const from = moment(trigger.start_time)
      const to = moment(trigger.end_time)
      const time = moment(date)

      from.set('year', time.get('year'))
      from.set('month', time.get('month'))
      from.set('date', time.get('date'))
      to.set('year', time.get('year'))
      to.set('month', time.get('month'))
      to.set('date', time.get('date'))

      if (!time.isBetween(from, to)) return false
    }

    return true
  }
}
Object.keys(AttackPattern.states).forEach(s => {
  AttackPattern.states[s].children.forEach(child => {
    AttackPattern.states[s].canCommit[child] = canCommitGenerator(AttackPattern.states[s].trigger[child])
  })
})

console.log('--------ATTACKPATTERN----------------------------');
console.log(AttackPattern);
console.log('------------------------------------');

var moment = require('moment');
moment().format();

const test_data = {
  user: 'awood1963',
  device: 'pc03',
  date: '01/01/2013  08:33:23',
  activity: 'login',
  color: 'Red'
}
console.log(AttackPattern.states.s0.canCommit.s1(test_data))



// export const unzipAttackPattern = (AttackPattern) => {

// }


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

export const parsedDate = (date) => moment(date, 'DD/MM/YYYY HH:mm')

// get moves
export const parseLog = (model, tuple) => {
  const pattern = AttackPattern.states
  // const initialStates = getIntialStates(pattern)
  // dispatchUserMoveTo(id, moveFrom, moveTo, severalHoursLater(2))
  // let user = id
  let moves = [], expired = []
  // {id, pc, action, date}
  const {user, device, activity, date} = tuple

  // const now = key_data.Date
  const now = date

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
    // return parsedDate(now).diff(parsedDate(commitTime), 'minutes') > pattern[moveTo].timeout
    return parsedDate(now).diff(parsedDate(commitTime), 'minutes') > pattern[moveFrom].timeout[moveTo]
  }
  const isExpiredState = (state) => {
    if (pattern[state.id].isOutcome) return false
    // const commitTime = model.UserView[user].find(elem => elem.id === stateId).commitTime
    return pattern[state.id].children.reduce((a,b) => {
      if (!a) return false
      return isExpiredMove(state.commitTime, state.id, b)
    }, true)
  }

  let map = {}, expiredMap = {}

  if (model.UserView[user]) {
    model.UserView[user].forEach((s) => {

      // add expired moves
      pattern[s.id].children.forEach((c) => {
        if (isExpiredMove(s.commitTime, s.id, c)) {
          if (!expiredMap[c] || parsedDate(expiredMap[c].commitTime).isBefore(parsedDate(s.commitTime))) {
            expiredMap[c] = {...s}
          }
        }
      })

      // check whether this is a expired state
      if (isExpiredState(s)) {
        // //console.log('Expired state:', s.id)
        moves.push({from: s.id, to: 's0'})
      } else {
        pattern[s.id].children.forEach((c) => {
          // can commit
          // TODO: change the canCommit to transition
          if (pattern[s.id].canCommit[c](tuple)  ) {
            // not expired
            // if (!pattern[s.id].timeout[c] || Date.now() - s.commitTime < pattern[s.id].timeout[c]) {
            if (!isExpiredMove(s.commitTime, s.id, c)) {
              // when two moves to the same node
              // parsedDate(map[c])
              if (!map[c] || parsedDate(map[c].commitTime).isBefore(parsedDate(s.commitTime))) { // use the larger (later) commit time
                map[c] = {...s}
                // id
                // commitTime
              }
            } else {
              //console.log('Expired!!!!!!!!!!!!!!!');
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
  Object.entries(expiredMap).forEach(([k, v]) => {
    expired.push({from: v.id, to: k})
  })

  return {moves, expired}

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
  // //console.log('trace back');
  // const pattern = AttackPattern.states
  if (stateId === 's0') return []
  let result = [stateId]
  const initialTransitions = pattern[stateId].parents.map(parent => Track[userId][parent + ' ' + stateId]).filter(n => n!=undefined)
  if (!initialTransitions.length) {
    return result
  }
  const largest = initialTransitions.reduce((a,b) => {
    return parsedDate(a).isAfter(parsedDate(b)) ? a : b
  })
  //console.log('largest', largest)

  const dfs = (currentNode) => {
    const transitions = pattern[currentNode].parents.map(parent => parent + ' ' + currentNode).filter(n => Track[userId][n] != undefined)
    // //console.log(transitions)
    if (!transitions.length) 
      return
    else {
      let targetTransition = transitions.reduce((a,b) => {
          if (stateId === 's4' && userId === 'lbegum1962') {
            //console.log(a, b)
            //console.log(parsedDate(Track[userId][b]), parsedDate(largest))
          }
        if (!a && parsedDate(Track[userId][b]).isAfter(parsedDate(largest))) {
          // if (stateId === 's4' && userId === 'cwilki1951') {
          //   //console.log(a, b)
          //   //console.log(new Date(Track[userId][b]), new Date(largest))
          // }
          return undefined
        } else if (!a && !parsedDate(Track[userId][b]).isAfter(parsedDate(largest))) {
          return b
        } else {
          if (parsedDate(Track[userId][a]).isBefore(parsedDate(Track[userId][b])) 
            && !parsedDate(Track[userId][b]).isAfter(parsedDate(largest)))  {
            return b
          } else {
            return a
          }
        }

      }, undefined)

      if (targetTransition === undefined) { // all states were updated
          // if (stateId === 's4' && userId === 'cwilki1951') {
          //   //console.log(a, b)
          //   //console.log(new Date(Track[userId][b]), new Date(largest))
          // }
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
  if (result.length === 1) {
    // //console.log (stateId, userId, Track[userId])
    return 'adfasdfadsfasd'
  }
  // //console.log('result', result)
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
      // //console.log(action)

      // const {user, device, activity, key_data} = action.tuple
      const {user, device, activity, date} = action.tuple
      // const now = key_data.Date
      const now = date
      const moves = action.moves
      const expired = action.expired

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
        // //console.log(targetTuple)
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

        // record the trace of an attack
        if (pattern[move.to].isOutcome) {
          const trace = traceBack(move.to, user, Track, pattern).join(' ')
          // //console.log('complete trace,', trace)
          Statistic.traces[trace] = Statistic.traces[trace] || []
          Statistic.traces[trace].push({user, time: now})
        }


     
      })

      expired.forEach(move => {
        // record the timeout event
          Statistic.timeouts[user] = Statistic.timeouts[user] || {}
          Statistic.timeouts[user][move.from + ' ' + move.to] = Statistic.timeouts[user][move.from + ' ' + move.to] || 0
          Statistic.timeouts[user][move.from + ' ' + move.to]++
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

