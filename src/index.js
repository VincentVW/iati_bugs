import React from 'react'
import ReactDOM from 'react-dom'


import createHistory from 'history/createBrowserHistory'

import { ConnectedRouter } from 'react-router-redux'
import configureStore from './configureStore'

import { Provider } from 'react-redux'


import './scss/app.css'
import 'babel-polyfill'

import App from './containers/App'

const history = createHistory()
const store = configureStore({}, history)

export default store


ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter onUpdate={() => window.scrollTo(0, 0)} history={history}>
        <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)

