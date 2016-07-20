require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch'
import * as immutable from 'immutable'
import {oipaApiUrl} from '../config'

export const REQUEST_PUBLISHERS = 'REQUEST_PUBLISHERS'
function requestPublishers(meta) {
  return {
    type: REQUEST_PUBLISHERS,
    meta,
    receivedAt: Date.now()
  }
}

export const RECEIVE_PUBLISHERS = 'RECEIVE_PUBLISHERS'
function receivePublishers(meta, publishers) {
  return {
    type: RECEIVE_PUBLISHERS,
    meta,
    publishers: immutable.List(publishers),
    receivedAt: Date.now()
  }
}

export const ERROR_PUBLISHERS = 'ERROR_PUBLISHERS'
function failedToFetchPublishers(meta){
  return {
    type: ERROR_PUBLISHERS,
    meta,
    receivedAt: Date.now()
  }
}

export function fetchPublishers(ordering, filters) {
  return function (dispatch) {
    
    dispatch(requestPublishers())

    let filterChangeCounter = 0
    
    var filter_addition = '';
    if(filters != undefined){
      if(filters.get('filterChangeCounter') != undefined){
        filterChangeCounter = filters.get('filterChangeCounter')
      }

      let publisher = filters.get('publisher')
      if(publisher != undefined && publisher != ''){
        filter_addition += '&publisher=' + publisher;
      }

      let publisherName = filters.get('publisherName')
      if(publisherName != undefined && publisherName != ''){
        filter_addition += '&publisher_name=' + publisherName;
      }
    }

    let meta = immutable.Map({
      'filters': filters,
      'order': ordering,
      'count': -1,
      'filterChangeCounter': filterChangeCounter
    })
    
    return fetch(oipaApiUrl+`datasets/aggregations/?format=json&group_by=publisher&aggregations=note_count&order_by=`+ordering+filter_addition)
        .then((response) => {
        if (response.status >= 400) {
            dispatch(failedToFetchPublishers())
            return false;
        }
        return response.json();
      })
      .then((json) => {
          meta = meta.merge({
              "count": json.count,
          });
          dispatch(receivePublishers(meta, json.results))
          
        }
      )
  }
}