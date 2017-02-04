import React, {Component, PropTypes} from 'react'
import Icon from './Icon'
import LoadingBar from '../../shared/containers/LoadingBar'
import Button from './Button'
import MenuLink from '../../shared/components/MenuLink'
import DropDownMenu, {DropDownMenuOption} from '../../shared/components/DropDownMenu'
import {Link} from 'react-router'
//import DisplayError from '../containers/DisplayError'

/* TOP BAR ACTION LIST
 *  This component is to create the list of action at the right of the top bar (Login if no user and Language button).
 *
 *  Call to component should look something like this:
 *  <TopBarActionList (current_user="object")/>
 * */
export class TopBarActionList extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    return (
      <div className="nav navbar-nav navbar-right login-links navbar-guest">
      </div>
    )
  }

  getCurrentLanguage() {
    return "EN"
  }

  changeLang() {
    alert("Changed language!")
  }
}

/* TOP BAR BRAND
 *  This component is to create the image and name of application action at the left of the top bar.
 *
 *  Call to component should look something like this:
 *  <TopBarActionList openSideMenu="function"/>
 * */
export class TopBarBrand extends Component {
  constructor(props, context) {
    super(props, context)
  }

  handleOpeningSideMenu() {
    if (this.props.openSideMenu) {
      this.props.openSideMenu()
    }
  }

  render() {
    const {openSideMenu} = this.props

    return (
      <div className="navbar-brand">
        <span>HackaTown</span>
        {openSideMenu ?
          <a href="" id="side-menu-toggle" className="mobile side-menu-toggle"
             onclick={this.handleOpeningSideMenu()}>
            <img src="/assets/img/symbol-orange-white.svg"/>
            <span>MENU</span>
          </a>
          : null}
      </div>
    )
  }
}

TopBarBrand.propTypes = {
  openSideMenu: PropTypes.func
}

/* NOTIFICATION BUTTON
 *  This component is to create the top bar of the application.
 *
 *  Call to component should look something like this:
 *  <NotificationButton openNotifications="function"/>
 * */
export class NotificationButton extends Component {
  constructor(props, context) {
    super(props, context)
  }

  handleOpeningNotifications() {
    this.props.openNotifications()
  }

  render() {
    return (
      <div id="notification-button">
        <a onclick={() => {
          this.handleOpeningNotifications()
        }}>
          <div className="smaller-padding">
            <div className="medium-icon">
              <Icon icon_class={"fa-bell"}/>
            </div>
            {this.getUnread() ?
              <div className="number-icon">
                { this.getUnread() }
              </div>
              : null
            }
          </div>
        </a>
      </div>
    )
  }

  getUnread() {
    return 0
  }
}

NotificationButton.propTypes = {
  openNotifications: PropTypes.func
}

const DropDownMenuList = ({children}) => (
  <div className="drop-menus navbar-right">
    {children}
  </div>
)

DropDownMenuList.propTypes = {
  children: PropTypes.any
}

const RouterLinkList = ({routes}) => (
  <div className="router-options navbar">
    {routes.map((r, i) =>
      (<MenuLink key={i} route={r.route} text={r.text}/>)
    )}
  </div>
)

RouterLinkList.propTypes = {
  routes: PropTypes.array.isRequired
}


const TopBar = ({current_user, routes, logout}) => {
  let top_bar_class_name = "top-bar navbar"
  if (isIOSStandalone()) {
    top_bar_class_name += " ios-standalone"
  }
  let username = "Charles-Alexandre Gagnon"
  if (current_user.first_name && current_user.last_name) {
    username = current_user.first_name + " " + current_user.last_name
  }

  // REMOVED <DisplayError /> IF you want to put it back, use <DisplayErrorPopup /> instead

  return (
    <div>
      {
        isIOSStandalone() && <div className="mobile status-bar medium-grey-back"></div>
      }
      <nav id="top-bar" className={top_bar_class_name}>
        <TopBarBrand/>
        <div className="navbar-header">
          <div className="action-options desktop">
            <RouterLinkList routes={routes}/>
            <DropDownMenuList>
              {
                current_user &&
                <DropDownMenu menu_title={username}>
                  <DropDownMenuOption action={logout} text="Se déconnecter"/>
                </DropDownMenu>
              }
            </DropDownMenuList>
          </div>
          <TopBarActionList current_user={current_user}/>
        </div>
        <LoadingBar/>
      </nav>
    </div>
  )
}

const isIOSStandalone = () => {
  return false
}

TopBar.propTypes = {
  current_user: PropTypes.object,
  routes: PropTypes.array.isRequired,
  logout: PropTypes.func.isRequired
}

export default TopBar