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

export const TopBarBrandMinimal = ({}) => (
  <div className="navbar-brand">
    <span>Discover-E MTL</span>
  </div>
)


const TopBarWithoutMenu = ({}) => {
  let top_bar_class_name = "top-bar navbar"
  if (isIOSStandalone()) {
    top_bar_class_name += " ios-standalone"
  }

  return (
    <div>
      {
        isIOSStandalone() && <div className="mobile status-bar medium-grey-back"></div>
      }
      <nav id="top-bar" className={top_bar_class_name}>
        <TopBarBrandMinimal/>
        <LoadingBar/>
      </nav>
    </div>
  )
}

const isIOSStandalone = () => {
  return false
}

export default TopBarWithoutMenu
