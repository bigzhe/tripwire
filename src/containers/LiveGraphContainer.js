import {connect} from 'react-redux'
import {
  refreshGraphConfig,
  changeColor,
  changeSymbolType,
  userMoveTo,
  userMoveToMultiple,
  changeSize,
  updateLabel,
  setPresentFilter,
  setVisibilityFilter,
} from '../actions'
import LiveGraph from '../components/LiveGraph'

const mapStateToProps = (state) => {
  return {
    model: state.model, attackPattern: state.attackPattern,
    visibilityFilter: state.visibilityFilter
    // graphConfig: state.graphConfig
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  // dispatchLog: (log) => { dispatch(parseLog(log)) },
  dispatchChangeColor: (id, color) => {
    dispatch(changeColor(id, color))
  },
  dispatchChangeSymbolType: (id, symbolType) => {
    dispatch(changeSymbolType(id, symbolType))
  },
  dispatchUserMoveTo: (id, moveFrom, moveTo, expirationTime) => {
    dispatch(userMoveTo(id, moveFrom, moveTo, expirationTime))
  },
  dispatchUserMoveToMultiple: (id, moves) => {
    dispatch(userMoveToMultiple(id, moves))
  },
  dispatchChangeSize: (id, size) => {
    dispatch(changeSize(id, size))
  },
  dispatchUpdateLabel: (id, label) => {
    dispatch(updateLabel(id, id + '\n' + label.join('-')))
  },
  dispatchRefreshGraphConfig: () => {
    dispatch(refreshGraphConfig())
  },
  dispatchSetPresentFilter: (showType, id) => {
    dispatch(setPresentFilter(showType, id))
  },
  dispatchSetVisibilityFilter: (pattern) => {
    dispatch(setVisibilityFilter(pattern))
  },
})

const LiveGraphContainer = connect(mapStateToProps, mapDispatchToProps)(LiveGraph)

export default LiveGraphContainer
