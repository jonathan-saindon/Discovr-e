import {CALL_API} from 'redux-api-middleware'

const authMiddleware = ({getState, dispatch}) => next => action => {

  // Add header
  if (action[CALL_API]) {
    let token = getState().shared.application.token
    if (token !== null) {
      action[CALL_API].headers = {
        Authorization: 'Token ' + token,
        'Content-Type': 'application/json',
        ...action[CALL_API].headers
      }
    }
    else {
      action[CALL_API].headers = {
        'Content-Type': 'application/json',
        ...action[CALL_API].headers
      }
    }
  }

  return next(action)

}

export default authMiddleware