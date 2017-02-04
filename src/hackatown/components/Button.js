import React, {PropTypes} from 'react'
import Icon from './Icon'
import classnames from 'classnames'

const Button = ({shape, color, onClick, disabled, icon, text}) => {
    let buttonClasses = classnames("btn", "btn-" + color, {"disabled": disabled}, {"circle-btn":shape == "circle"})
    return (
        <a className={buttonClasses} onClick={() => onClick()} disabled={disabled}>
            {icon && <Icon icon_class={icon}/>}
            {text}
        </a>
    )
}

Button.propTypes = {
    shape: PropTypes.string,
    color: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    icon: PropTypes.string,
    text: PropTypes.string
}

export default Button