import merge from 'lodash/merge'
import {combineReducers} from 'redux'

import * as user from './user'

export const CLOSE_FORM = 'CLOSE_FORM'

export {user}

//REDUCERS
const entities = (state, action) => {
  //common stuff
  let newState = state;
  if (action.payload && action.payload.entities) {
    newState = merge({}, newState, action.payload.entities);
  }
  // your reducers can now just return the state when nothing is catched in the switch statements
  return combineReducers({
    user: user.user
  })(newState, action);
}



export default entities