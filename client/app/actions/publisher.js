require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch'
import * as immutable from 'immutable'
import {oipaApiUrl} from '../config'


export const REQUEST_PUBLISHER = 'REQUEST_PUBLISHER'
function requestPublisher(publisherId) {
  return {
    type: REQUEST_PUBLISHER,
    publisherId,
    receivedAt: Date.now()
  }
}

export const RECEIVE_PUBLISHER = 'RECEIVE_PUBLISHER'
function receivePublisher(publisherId, publisher) {
  return {
    type: RECEIVE_PUBLISHER,
    publisherId,
    publisher: immutable.Map(publisher),
    receivedAt: Date.now()
  }
}

export const ERROR_PUBLISHER = 'ERROR_PUBLISHER'
function failedToFetchPublisher(publisherId){
  return {
    type: ERROR_PUBLISHER,
    publisherId,
    receivedAt: Date.now()
  }
}


export function fetchPublisher(publisherId) {
  return function (dispatch) {

    dispatch(requestPublisher(publisherId))

    return fetch(oipaApiUrl+`publishers/`+publisherId+`/?format=json&fields=org_id,org_name,activity_count`)
        .then((response) => {
        if (response.status >= 400) {
            dispatch(failedToFetchPublisher(publisherId))
            return false;
        }
        return response.json();
      })
      .then((json) => {
          dispatch(receivePublisher(publisherId, json))
        }
      )
  }
}

export const REQUEST_PUBLISHER_DATASETS = 'REQUEST_PUBLISHER_DATASETS'
function requestPublisherDatasets(publisherId, page) {
  return {
    type: REQUEST_PUBLISHER_DATASETS,
    publisherId,
    page,
    receivedAt: Date.now()
  }
}

export const RECEIVE_PUBLISHER_DATASETS = 'RECEIVE_PUBLISHER_DATASETS'
function receivePublisherDatasets(publisherId, meta, publisherDatasets) {
  return {
    type: RECEIVE_PUBLISHER_DATASETS,
    publisherId,
    meta,
    publisherDatasets: immutable.List(publisherDatasets),
    receivedAt: Date.now()
  }
}

export const ERROR_PUBLISHER_DATASETS = 'ERROR_PUBLISHER_DATASETS'
function failedToFetchPublisherDatasets(publisherId, page){
  return {
    type: ERROR_PUBLISHER_DATASETS,
    publisherId,
    page,
    receivedAt: Date.now()
  }
}

export function fetchPublisherDatasets(publisherId, page, ordering) {
  return function (dispatch) {
    
    dispatch(requestPublisherDatasets(publisherId, page))

    let meta = immutable.Map({
      'page': page,
      'order': ordering,
      'count': -1,
      'next': false,
      'previous': false,
    })
    
    return fetch(oipaApiUrl+`datasets/?format=json&page_size=400&ordering=`+ordering+`&publisher=`+publisherId+`&fields=publisher,id,ref,title,type,source_url,date_updated,note_count`)
        .then((response) => {
			if (response.status >= 400) {
			    dispatch(failedToFetchPublisherDatasets(publisherId, page))
			    return false;
			}
			return response.json();
		})
		.then((json) => {
		  meta = meta.merge({
		      "count": json.count, 
		      "next": json.next,
		      "previous": json.previous
		  });
		  if(page > 1){
		    dispatch(addPublisherDatasets(publisherId, meta, json.results))
		  } else {
		    dispatch(receivePublisherDatasets(publisherId, meta, json.results))
		  }
		}
	)
  }
}

export const REQUEST_PUBLISHER_COMMON_ERRORS = 'REQUEST_PUBLISHER_COMMON_ERRORS'
function requestPublisherCommonErrors(publisherId) {
  return {
    type: REQUEST_PUBLISHER_COMMON_ERRORS,
    publisherId,
    receivedAt: Date.now()
  }
}

export const RECEIVE_PUBLISHER_COMMON_ERRORS = 'RECEIVE_PUBLISHER_COMMON_ERRORS'
function receivePublisherCommonErrors(publisherId, results) {
  return {
    type: RECEIVE_PUBLISHER_COMMON_ERRORS,
    publisherId,
    publisherCommonErrors: immutable.List(results),
    receivedAt: Date.now()
  }
}

export const ERROR_PUBLISHER_COMMON_ERRORS = 'ERROR_PUBLISHER_COMMON_ERRORS'
function failedToFetchPublisherDatasets(publisherId){
  return {
    type: ERROR_PUBLISHER_COMMON_ERRORS,
    publisherId,
    receivedAt: Date.now()
  }
}

export function fetchPublisherCommonErrors(publisherId) {
  return function (dispatch) {
    
    dispatch(requestPublisherCommonErrors(publisherId))
    
    return fetch(oipaApiUrl+`datasets/aggregations/?format=json&group_by=model&aggregations=note_count&order_by=-note_count&publisher=`+publisherId)
        .then((response) => {
        if (response.status >= 400) {
            dispatch(failedToFetchPublisherCommonErrors(publisherId))
            return false;
        }
        return response.json();
      })
      .then((json) => {
          dispatch(receivePublisherCommonErrors(publisherId, json.results))
        }
      )
  }
}

