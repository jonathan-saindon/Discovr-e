import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classNames from 'classnames'

/* LOADING BAR
 *  This component is to create a display card for an employee's attributes.
 *
 *  Call to component should look something like this:
 *  <LoadingBar/>
 * */
class LoadingBar extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    let className = classNames('end_menu', 'loading-bar', {'animated': this.props.loading})

    return (
      <div id="loading-bar" className={className}>
        <div id="bar-1" className="bar-1"></div>
        <div id="bar-2" className="bar-2"></div>
        <div id="bar-3" className="bar-3"></div>
        <div id="bar-4" className="bar-4"></div>
      </div>
    )
  }
}

LoadingBar.PropTypes = {
  loading: PropTypes.bool.isRequired
}


const mapStateToProps = (state) => {
  return {
    loading: false //TODO change this bool
  }
}

export default connect(
  mapStateToProps
)(LoadingBar)