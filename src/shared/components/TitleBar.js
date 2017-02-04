import React, { Component, PropTypes } from 'react'

export default class TitleBar extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { title, children } = this.props

    return (
      <div className="orange-back smaller-padding page-title">
        <h3>{title}</h3>
        <div className="action-buttons">
          {children}
        </div>
      </div>
    )
  }
}

TitleBar.propTypes = {
  title: PropTypes.string.isRequired
}
