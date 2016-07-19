require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch'
import {List} from 'immutable'
import {oipaApiUrl} from '../config'

export const REQUEST_PUBLISHERS = 'REQUEST_PUBLISHERS'
function requestPublishers() {
  return {
    type: REQUEST_PUBLISHERS,
    receivedAt: Date.now()
  }
}

export const RECEIVE_PUBLISHERS = 'RECEIVE_PUBLISHERS'
function receivePublishers(publishers) {
  return {
    type: RECEIVE_PUBLISHERS,
    publishers: List(publishers),
    receivedAt: Date.now()
  }
}

export const ERROR_PUBLISHERS = 'ERROR_PUBLISHERS'
function failedToFetchPublishers(){
	return {
		type: ERROR_PUBLISHERS,
		receivedAt: Date.now()
	}
}

export function fetchPublishers() {
  return function (dispatch) {

    dispatch(requestPublishers())

    return fetch(oipaApiUrl+`datasets/aggregations/?format=json&group_by=publisher&aggregations=note_count&order_by=-note_count`)
        .then((response) => {
      	if (response.status >= 400) {
            dispatch(failedToFetchPublishers())
            return false;
        }
      	return response.json();
      })
      .then((json) => {
      		dispatch(receivePublishers(json.results))
      	}
      )
  }
}





