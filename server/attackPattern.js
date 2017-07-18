const AttackPattern = {
  info: {
    patterns: ['1','2','3']
  },
  states: {
    s0: {
      id: 's0',
      isInitial: true,
      label: 'initial state for pattern 1',
      children: ['s1'],
      parents: [],
      // fy: 800,
      // canCommit: () => true,
      canCommit: {
        s1: (tuple) => {
          const {user, device, activity, key_data} = tuple
          switch (activity) {
            case 'login':
              return true
              break;          
            default:
              return false
          }
        },
      },
      timeout: {
        s1: 999999999999999999999999999,
      },
      pattern: 'pattern1'
    },
    s1: {
      id: 's1',
      label: 'Login',
      info: '',
      children: ['s2'],
      parents: ['s0'],
      timeout: {
        s2: 60, 
      },
      fy: 600,
      // canCommit: (user, action) => action.includes('s1'),
      canCommit: {
        s2: (tuple) => {
          const {user, device, activity, key_data} = tuple
          switch (activity) {
            case 'file':
              if (key_data.Path.startsWith("/admin"))
                return true
              break;          
            default:
              return false
          }
        },
      },
      // fy: 700,
      pattern: 'pattern1',
    },
    s2: {
      id: 's2',
      label: 'Another initial state',
      info: '',
      children: ['s3', 's4'],
      parents: ['s1'],
      // timeout: 1 * 60 * 60000,
      timeout: {
        s3: 60,
        s4: 60,
      },
      // fx: 350,
      fy: 400,
      // canCommit: (user, action) => action.includes('s2'),
      canCommit: {
        s3: (tuple) => {
          const {user, device, activity, key_data} = tuple
          switch (activity) {
            case 'insert':
              return true
              break;          
            default:
              return false
          }
        },
        s4: (tuple) => {
          const {user, device, activity, key_data} = tuple
          switch (activity) {
            case 'email':
              return true
              break;          
            default:
              return false
          }
        },
      },
      pattern: 'pattern1',
    },
    s3: {
      id: 's3',
      label: 'abc',
      info: '',
      children: ['s4'],
      parents: ['s2'],
      timeout: {
        s4: 30,
      },
      fy: 300,
      canCommit: {
        s4: (tuple) => {
          const {user, device, activity, key_data} = tuple
          switch (activity) {
            case 'remove':
              return true
              break;          
            default:
              return false
          }
        },
      },
      pattern: 'pattern1',
    },
    s4: {
      id: 's4',
      isOutcome: true,      
      label: 'bcd',
      info: '',
      children: [],
      parents: ['s2', 's3'],
      timeout: {},
      fx: 100,
      fy: 200,
      canCommit: {},
      pattern: 'pattern1',
    },
    // s5: {
    //   id: 's5',
    //   isOutcome: true,
    //   label: 'Final state',
    //   info: 'The outcome',
    //   children: [],
    //   timeout: 60 * 60000,
    //   fx: 200,
    //   fy: 200,
    //   parents: ['s0'],
    //   // canCommit: (user, action) => action.includes('s5'),
    //   canCommit: {},
    //   pattern: 'pattern1',
    // },
    // s6: {
    //   id: 's6',
    //   isOutcome: true,
    //   label: 'Final state',
    //   info: 'The outcome',
    //   children: [],
    //   timeout: 60 * 60000,
    //   fx: 300,
    //   fy: 200,
    //   parents: ['s0'],
    //   // canCommit: (user, action) => action.includes('s5'),
    //   canCommit: {},
    //   pattern: 'pattern1',
    // },
  }

};

export default AttackPattern
