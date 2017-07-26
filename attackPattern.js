
var jsonfile = require('jsonfile')
var file = 'server/attackPattern.json'


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
      if (re.exec(device) === null) return false
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

const initAttackPattern = (AttackPattern) => {
  if (!Object.keys(AttackPattern).length) {
    return {
      info: {
        patterns: []
      },
      states: {
        s0: {
          id: 's0',
          isInitial: true,
          label: 'initial state',
          children: [],
          parents: [],
          canCommit: {},
          trigger: {},
          timeout: {},
          pattern: 'universe'
        },
      }
    }
  } else {
    return AttackPattern
  }
}

const RAWAttackPattern = initAttackPattern(jsonfile.readFileSync(file))


Object.keys(RAWAttackPattern.states).forEach(s => {
  RAWAttackPattern.states[s].children = RAWAttackPattern.states[s].children || []
  RAWAttackPattern.states[s].parents = RAWAttackPattern.states[s].parents || []
  RAWAttackPattern.states[s].timeout = RAWAttackPattern.states[s].timeout || {}
  RAWAttackPattern.states[s].trigger = RAWAttackPattern.states[s].trigger || {}
  RAWAttackPattern.states[s].canCommit = RAWAttackPattern.states[s].canCommit || {}
})



const AttackPattern = {...RAWAttackPattern}
Object.keys(AttackPattern.states).forEach(s => {
  AttackPattern.states[s].children.forEach(child => {
    AttackPattern.states[s].canCommit[child] = canCommitGenerator(AttackPattern.states[s].trigger[child])
  })
})

console.log(AttackPattern)

export {RAWAttackPattern, AttackPattern}
export default AttackPattern

// const AttackPattern = {
//   info: {
//     patterns: ['pattern1']
//   },
//   states: {
//     s0: {
//       id: 's0',
//       isInitial: true,
//       label: 'initial state for pattern 1',
//       children: ['s1', 's5'],
//       parents: [],
//       // fy: 800,
//       // canCommit: () => true,
//       canCommit: {
//         s1: (tuple) => {
//           const {user, device, activity, key_data} = tuple
//           switch (activity) {
//             case 'login':
//               return true
//               break;          
//             default:
//               return false
//           }
//         },
//         s5: (tuple) => {
//           const {user, device, activity, key_data} = tuple
//           switch (activity) {
//             case 'login':
//               return true
//               break;          
//             default:
//               return false
//           }
//         },
//       },
//       trigger: {},
//       timeout: {
//         s1: 999999999999999999999999999,
//         s5: 999999999999999999999999999,
//       },
//       pattern: 'universe'
//     },
//     s5: {
//       id: 's5',
//       label: 'Login',
//       info: '',
//       children: ['s6'],
//       parents: ['s0'],
//       trigger: {},
//       timeout: {
//         s6: 24*60, 
//       },
//       fy: 600,
//       // canCommit: (user, action) => action.includes('s1'),
//       canCommit: {
//         s6: (tuple) => {
//           const {user, device, activity, key_data} = tuple
//           switch (activity) {
//             case 'file':
//               if (key_data.Path.startsWith("/admin"))
//                 return true
//               break;          
//             default:
//               return false
//           }
//         },
//       },
//       // fy: 700,
//       pattern: 'pattern2',
//     },
//     s6: {
//       id: 's6',
//       label: 'Login',
//       info: '',
//       children: [],
//       parents: ['s5'],
//       trigger: {},
//       timeout: {},
//       fy: 600,
//       // canCommit: (user, action) => action.includes('s1'),
//       canCommit: {},
//       // fy: 700,
//       pattern: 'pattern2',
//     },
//     s1: {
//       id: 's1',
//       label: 'Login',
//       info: '',
//       children: ['s2'],
//       parents: ['s0'],
//       trigger: {},
//       timeout: {
//         s2: 24*60, 
//       },
//       fy: 600,
//       // canCommit: (user, action) => action.includes('s1'),
//       canCommit: {
//         s2: (tuple) => {
//           const {user, device, activity, key_data} = tuple
//           switch (activity) {
//             case 'file':
//               if (key_data.Path.startsWith("/admin"))
//                 return true
//               break;          
//             default:
//               return false
//           }
//         },
//       },
//       // fy: 700,
//       pattern: 'pattern1',
//     },
//     s2: {
//       id: 's2',
//       label: 'Another initial state',
//       info: '',
//       children: ['s3', 's4'],
//       parents: ['s1'],
//       // timeout: 1 * 60 * 60000,
//       trigger: {},
//       timeout: {
//         s3: 60,
//         s4: 60,
//       },
//       // fx: 350,
//       fy: 400,
//       // canCommit: (user, action) => action.includes('s2'),
//       canCommit: {
//         s3: (tuple) => {
//           const {user, device, activity, key_data} = tuple
//           switch (activity) {
//             case 'insert':
//               return true
//               break;          
//             default:
//               return false
//           }
//         },
//         s4: (tuple) => {
//           const {user, device, activity, key_data} = tuple
//           switch (activity) {
//             case 'email':
//               return true
//               break;          
//             default:
//               return false
//           }
//         },
//       },
//       pattern: 'pattern1',
//     },
//     s3: {
//       id: 's3',
//       label: 'abc',
//       info: '',
//       children: ['s4'],
//       parents: ['s2'],
//       timeout: {
//         s4: 30,
//       },
//       fy: 300,
//       canCommit: {
//         s4: (tuple) => {
//           const {user, device, activity, key_data} = tuple
//           switch (activity) {
//             case 'remove':
//               return true
//               break;          
//             default:
//               return false
//           }
//         },
//       },
//       trigger: {},
//       pattern: 'pattern1',
//     },
//     s4: {
//       id: 's4',
//       isOutcome: true,      
//       label: 'bcd',
//       info: '',
//       children: [],
//       parents: ['s2', 's3'],
//       timeout: {},
//       fx: 100,
//       fy: 200,
//       canCommit: {},
//       trigger: {},
//       pattern: 'pattern1',
//     },
//     // s5: {
//     //   id: 's5',
//     //   isOutcome: true,
//     //   label: 'Final state',
//     //   info: 'The outcome',
//     //   children: [],
//     //   timeout: 60 * 60000,
//     //   fx: 200,
//     //   fy: 200,
//     //   parents: ['s0'],
//     //   // canCommit: (user, action) => action.includes('s5'),
//     //   canCommit: {},
//     //   pattern: 'pattern1',
//     // },
//     // s6: {
//     //   id: 's6',
//     //   isOutcome: true,
//     //   label: 'Final state',
//     //   info: 'The outcome',
//     //   children: [],
//     //   timeout: 60 * 60000,
//     //   fx: 300,
//     //   fy: 200,
//     //   parents: ['s0'],
//     //   // canCommit: (user, action) => action.includes('s5'),
//     //   canCommit: {},
//     //   pattern: 'pattern1',
//     // },
//   }

// };


