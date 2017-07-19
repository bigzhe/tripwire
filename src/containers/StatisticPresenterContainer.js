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
  setOverviewTrace,
} from '../actions'
import StatisticPresenter from '../components/statistic/StatisticPresenter'

const mapStateToProps = (state) => {
  return {
    model: state.model,
    presentFilter: state.presentFilter,
    attackPattern: state.attackPattern,
    overviewFilter: state.overviewFilter,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchSetPresentFilter: (showType, id) => {
    dispatch(setPresentFilter(showType, id))
  },
  dispatchHighlightTrace: (trace) => {
    dispatch(highlightTrace(trace))
  },
  dispatchSetOverviewTrace: (trace) => {
    dispatch(setOverviewTrace(trace))
  }
})

const StatisticPresenterContainer = connect(mapStateToProps, mapDispatchToProps)(StatisticPresenter)

export default StatisticPresenterContainer
