export const patternToGraphData = (pattern) => {
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
}

export const filterPattern = (pattern, target) => {
  let result = {}
  Object.entries(pattern).forEach(([key, value]) => {
    if (value.pattern === target)
      result[key] = value
  })
  return result
}
