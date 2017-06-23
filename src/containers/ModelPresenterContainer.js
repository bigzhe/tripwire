import {connect} from 'react-redux'
import {
  refreshGraphConfig,
  changeColor,
  changeSymbolType,
  userMoveTo,
  changeSize,
  updateLabel,
  setPresentFilter,
} from '../actions'
import ModelPresenter from '../components/ModelPresenter'

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
})

const ModelPresenterContainer = connect(mapStateToProps, mapDispatchToProps)(ModelPresenter)

export default ModelPresenterContainer
