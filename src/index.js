import './app/css'
import 'react-virtualized/styles.css'
import 'babel-polyfill'

import { browserHistory } from "react-router"
import { syncHistoryWithStore } from 'react-router-redux'

import Root from './app/Root';
import React from 'react'
import ReactDOM from 'react-dom'

import configureStore from './app/store/configureStore'

const store = configureStore({})
const history = syncHistoryWithStore(browserHistory, store)

history.listen(function (location) {
    window.ga('send', 'pageview', location.pathname);
});

export default store

document.addEventListener('DOMContentLoaded', function () {
    ReactDOM.render(
        <Root store={store} history={history} />,
        document.getElementById('root')
    )
});
