import React, {PropTypes} from 'react'
import '../../../node_modules/font-awesome/css/font-awesome.min.css'
import Icon from './Icon'
import classNames from 'classnames'

const StateIndicator = ({state_class, icon_class}) => (
    <span className={classNames('small-icon status', state_class)}>
    { icon_class && <Icon icon_class={icon_class}/> }
  </span>
)

StateIndicator.propTypes = {
    state_class: PropTypes.string.isRequired,
    icon_class: PropTypes.string
}

export default StateIndicator