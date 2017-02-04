import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import * as applicationActions from '../actions'

class DisplayError extends Component {
  render() {
    const {hideError, error} = this.props

    if (!error) return null

    return (
      <div className="error-message">
        <div>
          <button
            onClick={hideError}
            type="button"
            className="close-button">
            <i className="fa fa-times-circle"/>
          </button>
          <p>{error.message}</p>
          <pre>
            <code>{JSON.stringify(error.body, null, 2)}</code>
          </pre>
        </div>
      </div>
    )
  }
}

DisplayError.propTypes = {
  hideError: PropTypes.func.isRequired,
  error: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    error: state.shared.application.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    hideError: () => {
      dispatch(applicationActions.hideError())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DisplayError)
