import React, {PropTypes} from 'react'
import classNames from 'classnames'

const TopPanel = ({open, color, children, close}) => (
  <div className="panel-wrap">
    <div className={classNames('top-panel', color + '-back', {'slide-out': open})}>
      {children}
    </div>
    <div className={classNames('overlay', {'shown': open})} onClick={close}></div>
  </div>
)

TopPanel.propTypes = {
  open: PropTypes.bool,
  color: PropTypes.string.isRequired,
  children: PropTypes.any,
  close: PropTypes.func
}

export default TopPanel