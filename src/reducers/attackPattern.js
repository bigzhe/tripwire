const initialState = {

  patternToGraphData: (pattern) => {
    let nodes = [], links = []
    const pickColor = (item) => {
      if (item.isInitial) return 'lightgreen'
      else if (item.isOutcome) return '#F44336' // red
      else return '#FFCA28' // amber
    }
    const pickFy = (item) => {
      if (item.fy) return item.fy
      else if (item.isInitial) return 700
      else if (item.isOutcome) return 100
      else return null
    }
    for (let [id, item] of Object.entries(pattern)) {
      nodes.push({
        id,
        fx: item.fx,
        // fy: item.fy,
        color: pickColor(item),
        fy: pickFy(item)
      })
      for (let child of item.children)
        links.push({source: id, target: child})
    }
    return {nodes, links}
  },
  pattern1: {
    s1: {
      id: 's1',
      isInitial: true,
      label: 'The initial state',
      info: '',
      children: ['s3', 's4'],
      fx: 100,
      canCommit: (user, action) => true,
      // fy: 700,
    },
    s2: {
      id: 's2',
      isInitial: true,
      label: 'Another initial state',
      info: '',
      children: ['s4'],
      fx: 350,
      canCommit: (user, action) => true,
    },
    s3: {
      id: 's3',
      label: 'abc',
      info: '',
      children: ['s4', 's5'],
      canCommit: (user, action) => action.includes('s3'),
    },
    s4: {
      id: 's4',
      label: 'bcd',
      info: '',
      children: ['s5'],
      fx: 220,
      fy: 353,
      canCommit: (user, action) => action.includes('s4')
    },
    s5: {
      id: 's5',
      isOutcome: true,
      label: 'Final state',
      info: 'The outcome',
      children: [],
      canCommit: (user, action) => action.includes('s5'),
    },

  },
  pattern2: {

  }

};

const attackPattern = (state = initialState, action) => {
  switch (action.type) {
    case 'PARSE_LOG':
      return {

      }
    default:
      return state
  }
}

export default attackPattern
