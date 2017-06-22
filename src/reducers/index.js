import { combineReducers } from 'redux';
// import todos from './todos';
// import visibilityFilter from './visibilityFilter';
import message from './message'
import sendingStatus from './sendingStatus'

const reducers = combineReducers({
  // todos,
  // visibilityFilter,
  message,
  sendingStatus,
});

export default reducers;
