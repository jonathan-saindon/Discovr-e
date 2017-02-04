import React, {PropTypes} from 'react'
import SimpleMap from '../components/SimpleMap'
const Map = ({children}) => (
  <div id="main-content">
    <p>here</p>
    <SimpleMap/>
    {children}
  </div>
)

Map.propTypes = {
  children: PropTypes.any
}
export default Map
