import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'

import createHistory from 'history/createBrowserHistory'

import { ConnectedRouter } from 'react-router-redux'
import configureStore from './configureStore'


import './scss/App.css'
import 'babel-polyfill'

import App from './containers/App'

const history = createHistory()
const store = configureStore({}, history)

// Now you can dispatch navigation actions from anywhere!
// store.dispatch(push('/foo'))


export default store


ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter onUpdate={() => window.scrollTo(0, 0)} history={history}>
        <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)

