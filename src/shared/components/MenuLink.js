import React, {Component, PropTypes} from 'react'
import Icon from '../../hackatown/components/Icon'
import {Link} from 'react-router'

/* MenuLink
 *  This component is to create a button that executes a requested action on click.
 *
 *  Call to component should look something like this:
 *  <ActionButton route="string" (icon_class="string" text="string")/>
 * */
export default class MenuLink extends Component {
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
    const {text, icon_class, route} = this.props
    return (
      <div className="menu-item">
        <Link to={route} activeClassName="active">
          {icon_class ?
            <Icon icon_class={icon_class}/> :
            null
          }
          <span className="text">{text}</span>
        </Link>
      </div>
    )
  }
}

MenuLink.propTypes = {
  route: PropTypes.string.isRequired,
  icon_class: PropTypes.string,
  text: PropTypes.string
}