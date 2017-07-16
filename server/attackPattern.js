const AttackPattern = {
  info: {

  },
  states: {
    s0: {
      id: 's0',
      isInitial: true,
      label: 'initial state for pattern 1',
      children: ['s5'],
      parents: [],
      // canCommit: () => true,
      canCommit: {
        s5: (tuple) => {
          const {user, device, activity, key_data} = tuple
          switch (activity) {
            case 'file':
              console.log(key_data)
              if (key_data.Path.startsWith("/admin"))
                return true
              break;          
            default:
              return false
          }
        },
      },
      pattern: 'pattern1'
    },
    // s1: {
    //   id: 's1',
    //   label: 'The initial state',
    //   info: '',
    //   children: ['s3', 's4'],
    //   timeout: 9999999999999,
    //   fx: 100,
    //   // canCommit: (user, action) => action.includes('s1'),
    //   canCommit: {
    //     s3: (user, tuple) => {
    //       return tuple.includes('s3')
    //     },
    //     s4: (user, tuple) => {
    //       return tuple.includes('s4')
    //     }
    //   },
    //   parents: ['s0'],
    //   // fy: 700,
    //   pattern: 'pattern1',
    // },
    // s2: {
    //   id: 's2',
    //   label: 'Another initial state',
    //   info: '',
    //   children: ['s4'],
    //   parents: ['s0'],
    //   timeout: 9999999999999999,
    //   fx: 350,
    //   // canCommit: (user, action) => action.includes('s2'),
    //   canCommit: {
    //     s4: (user, tuple) => {
    //       return tuple.includes('s4')
    //     },
    //   },
    //   pattern: 'pattern1',
    // },
    // s3: {
    //   id: 's3',
    //   label: 'abc',
    //   info: '',
    //   children: ['s4', 's5'],
    //   parents: ['s1'],
    //   timeout: 5000,
    //   // canCommit: (user, action) => action.includes('s3'),
    //   canCommit: {
    //     s4: (user, tuple) => {
    //       return tuple.includes('s4')
    //     },
    //     s5: (user, tuple) => {
    //       return tuple.includes('s5')
    //     }
    //   },
    //   pattern: 'pattern1',
    // },
    // s4: {
    //   id: 's4',
    //   label: 'bcd',
    //   info: '',
    //   children: ['s5'],
    //   parents: ['s1', 's2', 's3'],
    //   timeout: 10000,
    //   fx: 220,
    //   fy: 353,
    //   // canCommit: (user, action) => action.includes('s4'),
    //   canCommit: {
    //     s5: (user, tuple) => {
    //       return tuple.includes('s5')
    //     },
    //   },
    //   pattern: 'pattern1',
    // },
    s5: {
      id: 's5',
      isOutcome: true,
      label: 'Final state',
      info: 'The outcome',
      children: [],
      timeout: 100,
      parents: ['s0'],
      // canCommit: (user, action) => action.includes('s5'),
      canCommit: {},
      pattern: 'pattern1',
    },
  }

};

export default AttackPattern
