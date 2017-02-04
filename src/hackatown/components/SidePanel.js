import React, {PropTypes} from 'react'
import classNames from 'classnames'

const SidePanel = ({open, color, children, close}) => (
  <div className="panel-wrap">
    <div className={classNames('side-panel', 'small-padding', color + '-back', {'slide-out': open})}>
      {children}
    </div>
    <div className={classNames('overlay', {'shown': open})} onClick={close}></div>
  </div>
)

SidePanel.propTypes = {
  open: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
  children: PropTypes.any,
  close: PropTypes.func
}

export default SidePanel