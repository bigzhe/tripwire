const AttackPattern = {
    s1: {
      id: 's1',
      isInitial: true,
      label: 'The initial state',
      info: '',
      children: ['s3', 's4'],
      fx: 100,
      canCommit: (user, action) => action.includes('s1'),
      // fy: 700,
      pattern: 'pattern1',
    },
    s2: {
      id: 's2',
      isInitial: true,
      label: 'Another initial state',
      info: '',
      children: ['s4'],
      fx: 350,
      canCommit: (user, action) => action.includes('s2'),
      pattern: 'pattern1',
    },
    s3: {
      id: 's3',
      label: 'abc',
      info: '',
      children: ['s4', 's5'],
      canCommit: (user, action) => action.includes('s3'),
      pattern: 'pattern1',
    },
    s4: {
      id: 's4',
      label: 'bcd',
      info: '',
      children: ['s5'],
      fx: 220,
      fy: 353,
      canCommit: (user, action) => action.includes('s4'),
      pattern: 'pattern1',
    },
    s5: {
      id: 's5',
      isOutcome: true,
      label: 'Final state',
      info: 'The outcome',
      children: [],
      canCommit: (user, action) => action.includes('s5'),
      pattern: 'pattern1',
    },

};

export default AttackPattern