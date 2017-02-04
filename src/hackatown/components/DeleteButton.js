import React, {PropTypes} from 'react'
import Icon from './Icon'
import classnames from 'classnames'

const DeleteButton = ({onClick, disabled, icon}) => {
    let buttonClasses = classnames("btn", "btn-delete", {"disabled": disabled})
    return (
        <a className={buttonClasses} onClick={() => onClick()} disabled={disabled}>
            {icon && <Icon icon_class={icon}/>}
        </a>
    )
}

DeleteButton.propTypes = {
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    icon: PropTypes.string,
}

export default DeleteButton