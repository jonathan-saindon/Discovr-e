import * as storage from '../../persistence/storage'
import {combineReducers} from 'redux'
import {push} from 'react-router-redux'
import {fetchData, postOrPutData, deleteData} from '../../middleware/api'


export const HIDE_ERROR = 'SHARE/HIDE_ERROR'
export const SHOW_ERROR = 'SHARE/SHOW_ERROR'
export const LOGGED_IN = 'SHARE/LOGGED_IN'
export const LOG_OUT = 'SHARE/LOG_OUT'
export const LOCALE_SWITCHED = 'SHARE/LOCALE_SWITCHED'
export const USER_RECV_DATA = 'SHARE/USER_RECV_DATA'


export function login(form) {
  return function (dispatch) {
    dispatch(postOrPutData(null, 'auth/login', {email: form.email, password: form.password}))
      .then((response) => {
        console.log(response)
        storage.put('token', response.payload.key)
        dispatch(loggedIn(response.payload.key))
        dispatch(push("/"))
      })
  }
}

export function logout() {
  return function (dispatch) {
    dispatch(postOrPutData(null, 'auth/logout', {}))
      .then(() => {
        storage.clear()
        dispatch({type: LOG_OUT})
        dispatch(push("/login"))
      })
  }
}

export function loggedIn(token) {
  return {
    type: LOGGED_IN,
    payload: {
      token
    }
  }
}
export const RESET_ERROR_MESSAGE = "test"

export function hideError() {
  return {type: HIDE_ERROR}
}

export function switchLocale(locale) {
  return {type: LOCALE_SWITCHED, payload: locale}
}
//reducer
const initialState = {
  token: null,
  locale: 'en',
  dataLoading: 0,
  dataLoaded: false,
  user: {
    permissions: []
  },
  error: null
}

export const application = (state = initialState, action) => {
  switch (action.type) {
    case LOGGED_IN:
      return {
        ...state,
        token: action.payload.token
      }
    case LOG_OUT:
      return {
        ...state,
        token: null
      }
    case LOCALE_SWITCHED:
      return {
        ...state,
        locale: action.payload
      }

    // TODO: this handle only API error responses.
    // We should also handle all other kind of application errors,
    // report them and show some kind of helpful message to the user.
    // case RECV_ERROR:
    // const {data, source} = action
    // return {
    //   ...state,
    //     // TODO: ideally we want to map API error response codes with some user-friendly messages.
    //     error: {
    //       source,
    //       message: data.message,
    //       statusCode: data.response ? data.response.status + " " + data.response.statusText : "",
    //       statusText: data.response ? data.response.statusText : "",
    //       body: data.body || (data instanceof Error ?
    //         (data.toString() + '\n' + data.stack) : data)
    //     }
    // },
    case SHOW_ERROR:
      const {data, source} = action
      return {
        ...state,
        // TODO: ideally we want to map API error response codes with some user-friendly messages.
        error: {
          source,
          message: data.message,
          statusCode: data.statusCode || data.code || data.response.status,
          body: data.body || (data instanceof Error ?
            (data.toString() + '\n' + data.stack) : data)
        }
      }
    case HIDE_ERROR:
      return {
        ...state,
        error: null
      }
    default:
      return state
  }
}

const initial_state = {
  current_user: {}
}

export const topBar = (state = initial_state, action) => {
  switch (action.type) {
    case USER_RECV_DATA:
      return {
        current_user: action.data
      }
    // case ActionTypes.USER_REQ_DATA:
    //   return state
    // case ActionTypes.USER_RECV_ERROR:
    //   return state
    default:
      return state
  }
}

const shared_reducer = combineReducers({
  topBar,
  application
})

export default shared_reducer