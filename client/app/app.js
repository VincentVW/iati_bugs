'use strict'

import './css'
import 'react-virtualized/styles.css'

import 'babel-polyfill'

import { createHistory } from 'history'
import { useRouterHistory, hashHistory } from "react-router"
import { syncHistoryWithStore } from 'react-router-redux'

// const browserHistory = useRouterHistory(createHistory)({
//     basename: '/app'
// });	

import React from 'react'
import ReactDOM from 'react-dom'

import configureStore from './store/configureStore';

const store = configureStore({})
// const history = syncHistoryWithStore(browserHistory, store)



export default store

import Root from './Root'

document.addEventListener('DOMContentLoaded', function () {
    ReactDOM.render(
    	<Root store={store} history={hashHistory} />,
        document.getElementById('app')
    )
});
