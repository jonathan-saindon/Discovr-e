import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {IntlProvider} from 'react-intl'
import {Router, Route, Redirect, browserHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'

import configureStore from './store/configureStore'
import * as storage from './persistence/storage'
import {logout} from './shared/ducks'
import * as i18n from './i18n'

import {fetchData} from './middleware/api'
import {Schemas} from './middleware/schema'

//pages
import UserProfile from './hackatown/pages/UserProfile'
import LoginPage from './shared/components/pages/LoginPage'
import ErrorPage from './shared/components/pages/ErrorPage'
import NotFoundPage from './shared/components/pages/NotFoundPage'
import Base from './hackatown/pages/Base'
import PublicBase from './hackatown/pages/PublicBase'

export const store = configureStore({
    shared: {
      application: {
        token: storage.get('token'),
        locale: storage.get('locale') || 'fr-CA',
        user: {permissions: [/*'manage_account'*/]}
      }
    }
  }
)

const history = syncHistoryWithStore(browserHistory, store)

export const API_URL = "http://api..com/"

function loadData() {
  store.dispatch(fetchData(Schemas.USER_ARRAY, "user"))
}

function selectAndLoad(route){
  loadData()
  store.dispatch(selectPropositionFromPairing(route.params.id))
}

function renderRoutes() {
  return (
    <Router key={Math.random()} history={history}>

      <Route component={Base} onEnter={requireAuth}>
        <Redirect from="/account" to="/account/profile"/>

        <Route path="/" component={Entreprises} onEnter={loadData}/>

        <Route path="/account/profile/:id" component={UserProfile} onEnter={loadData}/>

        <Route path="logout" onEnter={logout}/>
      </Route>

      <Route component={PublicBase}>
        <Route path="/login" component={LoginPage}/>
        <Route path="/error" component={ErrorPage}/>
      </Route>

      <Route path="*" component={NotFoundPage}/>
    </Router>
  )
}

const requireAuth = (nextState, replace) => {
  const state = store.getState()
  const isLoggedIn = Boolean(state.shared.application.token)
  if (!isLoggedIn)
    replace('/login')
}

const Root = (application) => (
  <IntlProvider key="intl" locale={application.locale} messages={i18n[application.locale]}>
    {renderRoutes()}
  </IntlProvider>
)

Root.propTypes = {
  application: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    application: state.shared.application
  }
}

const Master = connect(mapStateToProps)(Root)
export default Master