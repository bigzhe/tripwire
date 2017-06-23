import {connect} from 'react-redux'
import {
  refreshGraphConfig,
  changeColor,
  changeSymbolType,
  userMoveTo,
  changeSize,
  updateLabel,
  setPresentFilter
} from '../actions'
import LiveGraph from '../components/LiveGraph'

const mapStateToProps = (state) => {
  return {
    model: state.model, attackPattern: state.attackPattern,
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
})

const LiveGraphContainer = connect(mapStateToProps, mapDispatchToProps)(LiveGraph)

export default LiveGraphContainer
