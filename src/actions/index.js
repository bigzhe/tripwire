let nextTodoId = 0
let nextLog = 0
export const addTodo = (text) => ({
  type: 'ADD_TODO',
  id: nextTodoId++,
  text
})

export const setVisibilityFilter = (filter) => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
})

export const toggleTodo = (id) => ({
  type: 'TOGGLE_TODO',
  id
})

// Parse log
export const parseLog = (log) => ({
  type: 'PARSE_LOG',
  log
})

// Present the graph
export const changeColor = (id, color) => ({
  type: 'CHANGE_COLOR',
  id,
  color
})

export const changeSymbolType = (id, symbolType) => ({
  type: 'CHANGE_SYMBOLTYPE',
  id,
  symbolType
})

export const changeSize = (id, size) => ({
  type: 'CHANGE_SIZE',
  id,
  size
})

export const updateLabel = (id, label) => ({
  type: 'UPDATE_LABEL',
  id,
  label
})

export const refreshGraphConfig = () => ({
  type: 'REFRESH_GRAPHCONFIG'
})

// update model
export const userMoveTo = (id, moveFrom, moveTo, expirationTime) => ({
  type: 'USER_MOVE_TO',
  id, moveFrom, moveTo, expirationTime
})

export const userMoveToMultiple = (id, moves) => ({
  type: 'USER_MOVE_TO_MULTIPLE',
  user, moves,
})

// log
export const addLog = (text) => ({
  type: 'ADD_LOG',
  id: nextLog++,
  text
})

export const addCurrentLogUser = (user) => ({
  type: 'ADD_CURRENT_LOG_USER',
  user
})

export const updateCurrentLogAction = (action) => ({
  type: 'UPDATE_CURRENT_LOG_ACTION',
  action
})

// snackbar
export const openSnackBar = () => ({
  type: 'OPEN_SNACKBAR'
})

export const closeSnackBar = () => ({
  type: 'CLOSE_SNACKBAR'
})

export const setSnackbarMessage = (message) => ({
  type: 'SET_SNACKBAR_MESSAGE',
  message
})

// present filter
export const setPresentFilter = (showType, id) => ({
  type: 'SET_PRESENT_FILTER',
  showType, 
  id: id || undefined
})