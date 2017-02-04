import React, {PropTypes} from 'react'
import Icon from '../../hackatown/components/Icon'

const AttributeDisplay = ({label_value, icon_class, display_value, className}) => (
    <div className={className}>
        {
            label_value && <label>{label_value}</label>
        }
        {
            icon_class && <Icon icon_class={icon_class}/>
        }
        <span>{display_value}</span>
    </div>
)

AttributeDisplay.propTypes = {
    display_value: PropTypes.string.isRequired,
    label_value: PropTypes.string,
    icon_class: PropTypes.string,
    className: PropTypes.string
}

export default AttributeDisplay