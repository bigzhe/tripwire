import {connect} from 'react-redux'
import {
  refreshGraphConfig,
  changeColor,
  changeSymbolType,
  userMoveTo,
  changeSize,
  updateLabel,
  setPresentFilter,
  highlightTrace,
} from '../actions'
import StatisticPresenter from '../components/statistic/StatisticPresenter'

const mapStateToProps = (state) => {
  return {
    model: state.model,
    presentFilter: state.presentFilter,
    attackPattern: state.attackPattern,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchSetPresentFilter: (showType, id) => {
    dispatch(setPresentFilter(showType, id))
  },
  dispatchHighlightTrace: (trace) => {
    dispatch(highlightTrace(trace))
  },
})

const StatisticPresenterContainer = connect(mapStateToProps, mapDispatchToProps)(StatisticPresenter)

export default StatisticPresenterContainer
