import _ from 'lodash'
import * as immutable from 'immutable'

// import * as noteActions from './actions/notes'
import * as datasetActions from './actions/dataset'
import * as datasetsActions from './actions/datasets'
import * as publishersActions from './actions/publishers'
import * as modelAggregationActions from './actions/modelAggregation'
import * as commonActions from './actions/common'

import { combineReducers } from 'redux'


function setState(state, newState) {
  return state.merge(newState);
}

// function notes(state = immutable.List(), action) {
//   switch (action.type) {
//   	case noteActions.RECEIVE_NOTES:
//   		return action.notes
//     default:
//    		return state
//   }
// }

function datasets(state = immutable.Map({meta: immutable.Map({}), results: immutable.List()}), action) {
  switch (action.type) {
  	case datasetsActions.RECEIVE_DATASETS:
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

function datasetNotes(state = immutable.Map({loading: true, meta: immutable.Map({}), results: immutable.List()}), action) {
  switch (action.type) {
    case datasetActions.REQUEST_DATASET_NOTES:
      if (action.page == 1){
        state = state.set('results', immutable.List())
      }
      state = state.set('loading', true)
      return state
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

function publishers(state = immutable.List(), action) {
  switch (action.type) {
    case publishersActions.RECEIVE_PUBLISHERS:
      return action.publishers
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

import { routerReducer as routing } from 'react-router-redux'

const rootReducer = combineReducers({
    // notes,
    loader,
    datasets,
    dataset,
    datasetNotes,
    datasetCommonErrors,
    publishers,
    modelAggregation,
    routing,
})

export default rootReducer