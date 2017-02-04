import React, {PropTypes} from 'react'
import AttributeDisplay from '../../../shared/components/AttributeDisplay'
import Picture from '../../../hackatown/components/Picture'
import Icon from '../../../hackatown/components/Icon'

const Contact = ({contact, picture_size, edit}) => {
  if (typeof contact !== "undefined") {
    return (
      <div className="contact-info" key={"contact-info_" + contact.id} onClick={() => edit(contact.id)}>
        {
          contact.first_name ? <Picture name={contact.first_name} size={picture_size ? picture_size : "medium"} shape="profile-photo"/> :
            <Picture name="?" size={picture_size ? picture_size : "medium"} shape="profile-photo"/>
        }
        { edit &&
          <span className='small-icon'>
            <Icon icon_class="fa-pencil"/>
          </span>
        }
        <strong className="contact-name smaller-padding-bottom">
          {
            contact.first_name ? <span className="name element contact">{contact.first_name + " " + contact.last_name}</span> :
              <span className="name element contact">Contact Sans-Nom</span>
          }
          {
            contact.position && <span className="poste element"> {" - " + contact.position} </span>
          }
        </strong>
        {
          contact.username && <AttributeDisplay className="username element contact secondary" display_value={"@" + contact.username}/>
        }
        <AttributeDisplay className="email element contact secondary" display_value={contact.email}/>
        <AttributeDisplay className="cellphone element contact secondary" display_value={contact.mobile_phone}/>
      </div>
    )
  }
  else {
    return (<div>Loading...</div>)
  }
}

Contact.propTypes = {
  contact: PropTypes.object,
  picture_size: PropTypes.string,
  edit: PropTypes.func
}

export default Contact