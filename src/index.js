import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Master, {store} from './Root'
import {addLocaleData} from 'react-intl'
import en from 'react-intl/locale-data/en'
import fr from 'react-intl/locale-data/fr'

addLocaleData(en)
addLocaleData(fr)

require('./hackatown/styles/style.sass')

// All modern browsers, except `Safari`, have implemented
// the `ECMAScript Internationalization API`.
// For that we need to patch in on runtime.
if (!global.Intl)
  require.ensure(['intl'], require => {
    require('intl').default
    start()
  }, 'IntlBundle')
else start()

function start () {
  ReactDOM.render(
    <Provider store={store}>
      <Master />
    </Provider>
    , document.getElementById('root'))
}
