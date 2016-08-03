'use strict'

import './css'
import 'react-virtualized/styles.css'
import ga from 'ga-react-router'
import 'babel-polyfill'

import { createHistory } from 'history'
import { useRouterHistory, browserHistory } from "react-router"
import { syncHistoryWithStore } from 'react-router-redux'


// const browserHistory = useRouterHistory(createHistory)({
//     basename: '/app'
// });	

import React from 'react'
import ReactDOM from 'react-dom'

import configureStore from './store/configureStore';

const store = configureStore({})
const history = syncHistoryWithStore(browserHistory, store)

const unlisten = history.listen(location => {
  ga('send', location);
});


export default store

import Root from './Root'

document.addEventListener('DOMContentLoaded', function () {
    ReactDOM.render(
    	<Root store={store} history={history} />,
        document.getElementById('app')
    )
});


unlisten()