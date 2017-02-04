import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

class DisplayError extends Component {
  render() {
    const {error} = this.props

    if (!error) return null

    return (
      <div className="error-message">
        <div>
          <p>{error.message} {error.statusText ? error.statusText : null}</p>

          <pre>
            <code>{error.body}</code>
          </pre>
        </div>
      </div>
    )
  }
}

DisplayError.propTypes = {
  error: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    error: state.shared.application.error
  }
}

export default connect(
  mapStateToProps
)(DisplayError)
