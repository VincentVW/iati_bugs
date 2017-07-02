import { createStore, applyMiddleware, compose, combineReducers } from 'redux';

import reducers from './reducers'

import invariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';
import {routerMiddleware, routerReducer } from 'react-router-redux'


export default function configureStore(preloadedState, history) {
  
  const enhancer = compose(
    applyMiddleware(invariant(), thunk, routerMiddleware(history)),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  );

  const store = createStore(combineReducers({
    ...reducers,
    router: routerReducer
  }), preloadedState, enhancer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextReducer = require('./reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

