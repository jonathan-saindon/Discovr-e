import React, {PropTypes} from 'react'
import TopBarWithoutMenu from '../components/TopBarWithoutMenu'

const PublicBase = ({children}) => (
  <div id="main-content">
    <TopBarWithoutMenu />
    {children}
  </div>
)

PublicBase.propTypes = {
  children: PropTypes.any
}
export default PublicBase