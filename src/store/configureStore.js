import {createStore, applyMiddleware, compose, combineReducers} from 'redux'
import {routerReducer, routerMiddleware} from 'react-router-redux'
import {browserHistory} from 'react-router'
// import {reduxReactRouter, routerStateReducer} from 'redux-router'
// import createBrowserHistory from 'history/lib/createBrowserHistory'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import persistenceStore from '../persistence/store'
import {reducer as formReducer} from 'redux-form'
import entities from '../hackatown/ducks'
import shared_reducer from '../shared/ducks'
// import api from '../middleware/api'
import { apiMiddleware } from 'redux-api-middleware';
import authMiddleware from '../middleware/auth'

const isProd = () => (process.env.NODE_ENV === 'production')
const logger = isProd() ? null : createLogger()
const reducer_folder_list = ['../company/ducks', '../contact/ducks', '../pairing/ducks', '../shared/ducks']

const all_reducers = combineReducers({
  entities: entities,
  shared: shared_reducer,
  routing: routerReducer,
  form: formReducer
})

const storeEnhancers = [
  persistenceStore
]

const routerMid = routerMiddleware(browserHistory)

const finalCreateStore = compose(
  applyMiddleware(authMiddleware, apiMiddleware, logger, thunk, routerMid),
  ...storeEnhancers,
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)

const finalCreateStoreProd = compose(
  applyMiddleware(authMiddleware, apiMiddleware, thunk),
  ...storeEnhancers
)(createStore)

export default function configureStore(initialState) {
  const store = isProd() ? finalCreateStoreProd(all_reducers, initialState) :
    finalCreateStore(all_reducers, initialState)


  if (!isProd()) {
    if (module.hot) {
      module.hot.accept(reducer_folder_list, () =>
        store.replaceReducer(all_reducers)
      )
    }
  }

  return store
}