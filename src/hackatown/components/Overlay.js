import React, {Component, PropTypes} from 'react'
import classNames from 'classnames'

export default class Overlay extends Component {
  constructor(props, context) {
    super(props, context)
  }

  handleAction() {
    this.props.action()
  }

  render() {
    const {display} = this.props

    let display_class = display ? "display" : ""

    return (
      <div id="overlay" className={display_class} onClick={() => {this.handleAction()}}></div>
    )
  }
}

Overlay.propTypes = {
  display: PropTypes.bool.isRequired,
  action: PropTypes.func.isRequired
}