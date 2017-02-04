import React, {Component, PropTypes} from 'react'
import Picture from '../../hackatown/components/Picture'
import Icon from '../../hackatown/components/Icon'
//todo cleanup to stateless comp
export default class DropDownMenu extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const {menu_title, picture, children} = this.props

    return (
      <div className="drop-menu">
        <div id="profile-link" className="drop-menu-switch">
          <Picture name={menu_title} size="small" picture={picture} shape={"logo"}/>
          <div className="user-info">
            <div className="username bigger">
              { menu_title }
            </div>
          </div>
          <div className="drop-down-arrow">
            <Icon icon_class={"fa-chevron-down"}/>
          </div>
        </div>
        <div id="profile-menu" className="drop-menu-options">
          <ul>
            {children}
          </ul>
        </div>
      </div>
    )
  }
}

DropDownMenu.propTypes = {
  menu_title: PropTypes.string.isRequired,
  picture: PropTypes.string
}

//todo split in two files!
export class DropDownMenuOption extends Component {
  constructor(props, context) {
    super(props, context)
  }

  handleAction() {
    if (this.props.parameters) {
      this.props.action(this.props.parameters)
    } else {
      this.props.action()
    }
  }

  render() {
    const {text, icon_class} = this.props

    return (
      <li>
        <a id='profile' onClick={() => this.handleAction()}>
          {
            icon_class && <span className="icon circle"><Icon icon_class={icon_class}/></span>
          }
          <span className="text">{text}</span>
        </a>
      </li>
    )
  }
}

DropDownMenuOption.propTypes = {
  action: PropTypes.func.isRequired,
  parameters: PropTypes.object,
  icon_class: PropTypes.string,
  text: PropTypes.string
}