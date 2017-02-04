import React, {PropTypes} from 'react'
import Contact from './Contact'
import {isEmpty} from 'lodash'

const UserInfo = ({user}) => {
  if (!isEmpty(user)) {
    return (
      <div className="info medium-padding-bottom big-padding-top ">
        <div className="wrap">
          <div className="third">
            <div className="text-infos">
              <Contact contact={user} picture_size={"medium"} />
            </div>
          </div>
        </div>
      </div>
    )
  }
  else {
    return (<div>Loading...</div>)
  }
}

UserInfo.propTypes = {
  user: PropTypes.object,
}

export default UserInfo