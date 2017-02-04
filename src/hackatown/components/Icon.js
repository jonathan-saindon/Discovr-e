import React, { Component, PropTypes } from 'react'
import '../../../node_modules/font-awesome/css/font-awesome.min.css'
import classNames from 'classnames'

/* ICON
 *  This component is to create an icon using the font-awesome library.
 *
 *  Call to component should look something like this:
 *  <Icon (icon_class="string")/>
 * */
const Icon = ({icon_class}) => (
  <i className={classNames('fa', icon_class)}/>
)

Icon.propTypes = {
  icon_class: PropTypes.string.isRequired
}

export default Icon