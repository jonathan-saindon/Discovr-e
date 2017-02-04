import React from 'react'
import UserInfo from './containers/UserInfo'

const UserProfileApp = ({params}) => (
  <div className="user-profile">
    <UserInfo id={params.id} />
  </div>
)

export default UserProfileApp
