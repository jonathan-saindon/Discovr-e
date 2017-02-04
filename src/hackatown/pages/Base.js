import React, {PropTypes} from 'react'
import Menu from '../containers/Menu'

const Base = ({children}) => (
  <div id="main-content">
    <Menu />
    {children}
  </div>
)

Base.propTypes = {
  children: PropTypes.any
}
export default Base