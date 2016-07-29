import * as immutable from 'immutable'

import * as datasetActions from './actions/dataset'
import * as datasetsActions from './actions/datasets'
import * as publisherActions from './actions/publisher'
import * as publishersActions from './actions/publishers'
import * as modelAggregationActions from './actions/modelAggregation'
import * as commonActions from './actions/common'

import { combineReducers } from 'redux'


function setState(state, newState) {
  return state.merge(newState);
}

function datasets(state = immutable.Map({meta: immutable.Map({filterChangeTime: 0}), results: immutable.List()}), action) {
  switch (action.type) {
  	case datasetsActions.RECEIVE_DATASETS:
      if(state.get('meta').get('filterChangeTime') > action.meta.get('filterChangeTime')){
        return state;
      }

  		return immutable.Map({
        'meta': action.meta,
        'results': action.datasets})
    case datasetsActions.ADD_DATASETS:
      return immutable.Map({
        'meta': action.meta,
        'results': state.get('results').concat(action.datasets)})
    default:
   		return state
  }
}

function dataset(state = immutable.Map(), action) {
  switch (action.type) {
    case datasetActions.RECEIVE_DATASET:
      return action.dataset
    default:
      return state
  }
}

function datasetNotes(state = immutable.Map({loading: false, meta: immutable.Map({count: 0, filterChangeCounter: 0}), results: immutable.List()}), action) {
  switch (action.type) {
    case datasetActions.RECEIVE_DATASET_NOTES:
      return immutable.Map({
        'loading': false,
        'meta': action.meta,
        'results': action.datasetNotes})
    case datasetActions.ADD_DATASET_NOTES:
      return immutable.Map({
        'loading': false,
        'meta': action.meta,
        'results': state.get('results').concat(action.datasetNotes)})
    default:
      return state
  }
}

function datasetCommonErrors(state = immutable.Map({loading: true, results: immutable.List()}), action) {
  switch (action.type) {
    case datasetActions.REQUEST_DATASET_COMMON_ERRORS:      
      state = state.set('loading', true)
      return state
    case datasetActions.RECEIVE_DATASET_COMMON_ERRORS:
      return immutable.Map({
        'loading': false,
        'results': action.datasetCommonErrors})
    default:
      return state
  }
}

function publishers(state = immutable.Map({meta: immutable.Map({count: 0, filterChangeTime: 0}), results: immutable.List()}), action) {
  switch (action.type) {
    case publishersActions.RECEIVE_PUBLISHERS:
      if(state.get('meta').get('filterChangeTime') > action.meta.get('filterChangeTime')){
        return state;
      }
      return immutable.Map({
        'meta': action.meta,
        'results': action.publishers})
    default:
      return state
  }
}

function publisher(state = immutable.Map(), action) {
  switch (action.type) {
    case publisherActions.RECEIVE_PUBLISHER:
      return action.publisher
    default:
      return state
  }
}

function publisherDatasets(state = immutable.Map({loading: true, meta: immutable.Map({count: 0}), results: immutable.List()}), action) {
  switch (action.type) {
    case publisherActions.REQUEST_PUBLISHER_DATASETS:
      if (action.page == 1){
        state = state.set('results', immutable.List())
      }
      state = state.set('loading', true)
      return state
    case publisherActions.RECEIVE_PUBLISHER_DATASETS:
      return immutable.Map({
        'loading': false,
        'meta': action.meta,
        'results': action.publisherDatasets})
    default:
      return state
  }
}

function publisherCommonErrors(state = immutable.Map({loading: true, results: immutable.List()}), action) {
  switch (action.type) {
    case publisherActions.REQUEST_PUBLISHER_COMMON_ERRORS:      
      state = state.set('loading', true)
      return state
    case publisherActions.RECEIVE_PUBLISHER_COMMON_ERRORS:
      return immutable.Map({
        'loading': false,
        'results': action.publisherCommonErrors})
    default:
      return state
  }
}

function modelAggregation(state = immutable.List(), action) {
  switch (action.type) {
    case modelAggregationActions.RECEIVE_MODEL_AGGREGATION:
      return action.modelAggregation
    default:
      return state
  }
}

function loader(state = false, action) {
  switch (action.type) {
    case datasetsActions.RECEIVE_DATASETS:
      return true
    case datasetsActions.REQUEST_DATASETS:
      return false
    default:
      return state
  }
}

function fullscreen(state = false, action) {
  switch (action.type) {
    case commonActions.ENABLE_FULLSCREEN:
      return true
    case commonActions.DISABLE_FULLSCREEN:
      return false
    default:
      return state
  }
}

import { routerReducer as routing } from 'react-router-redux'

const rootReducer = combineReducers({
    loader,
    datasets,
    dataset,
    datasetNotes,
    datasetCommonErrors,
    publishers,
    publisher,
    publisherDatasets,
    publisherCommonErrors,
    modelAggregation,
    fullscreen,
    routing,
})

export default rootReducer