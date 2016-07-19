require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch'
import {List} from 'immutable'
import {oipaApiUrl} from '../config'

export const REQUEST_MODEL_AGGREGATION = 'REQUEST_MODEL_AGGREGATION'
function requestModelAggregation() {
  return {
    type: REQUEST_MODEL_AGGREGATION,
    receivedAt: Date.now()
  }
}

export const RECEIVE_MODEL_AGGREGATION = 'RECEIVE_MODEL_AGGREGATION'
function receiveModelAggregation(modelAggregation) {
  return {
    type: RECEIVE_MODEL_AGGREGATION,
    modelAggregation: List(modelAggregation),
    receivedAt: Date.now()
  }
}

export const ERROR_MODEL_AGGREGATION = 'ERROR_MODEL_AGGREGATION'
function failedToFetchModelAggregation(){
	return {
		type: ERROR_MODEL_AGGREGATION,
		receivedAt: Date.now()
	}
}

export function fetchModelAggregation() {
  return function (dispatch) {

    dispatch(requestModelAggregation())

    return fetch(oipaApiUrl+`datasets/aggregations/?format=json&group_by=message&aggregations=note_count&order_by=-note_count`)
        .then((response) => {
      	if (response.status >= 400) {
            dispatch(failedToFetchModelAggregation())
            return false;
        }
      	return response.json();
      })
      .then((json) => {
      		dispatch(receiveModelAggregation(json.results))
      	}
      )
  }
}





