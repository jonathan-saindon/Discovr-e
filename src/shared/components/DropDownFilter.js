import React, {PropTypes} from 'react'
import {mapObj} from '../../hackatown/utils'

const DropDownFilter = ({options, name, default_text, onChange}) => (
  <div className="filter select">
    <label>{name}</label>
    <select onChange={e => onChange(e.target.value)}>
      <option className="default" value="">{default_text}</option>
      {
        mapObj(options, (key, value) =>
          <option key={"filter-option_" + value.id} value={value.id}>{value.name}</option>
        )
      }
    </select>
  </div>
)


DropDownFilter.propTypes = {
  options: PropTypes.object,
  default_text: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func
}

export default DropDownFilter