import { combineReducers } from 'redux'
import todos from './todos'
import visibilityFilter from './visibilityFilter'
import model from './model'
// import graphConfig from './graphConfig'
import attackPattern from './attackPattern'
import log from './log'
import snackbar from './snackbar'
import presentFilter from './presentFilter'

const todoApp = combineReducers({
  todos,
  visibilityFilter,
  model,
  // graphConfig,
  log,
  attackPattern,
  snackbar,
  presentFilter,
})

export default todoApp
