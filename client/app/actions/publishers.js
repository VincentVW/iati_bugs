require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch'
import * as immutable from 'immutable'
import {oipaApiUrl} from '../config'

export const REQUEST_PUBLISHERS = 'REQUEST_PUBLISHERS'
function requestPublishers(requestDateTime) {
  return {
    type: REQUEST_PUBLISHERS,
    receivedAt: requestDateTime
  }
}

export const RECEIVE_PUBLISHERS = 'RECEIVE_PUBLISHERS'
function receivePublishers(meta, publishers) {
  return {
    type: RECEIVE_PUBLISHERS,
    meta,
    publishers: immutable.List(publishers)
  }
}

export const ERROR_PUBLISHERS = 'ERROR_PUBLISHERS'
function failedToFetchPublishers(meta){
  return {
    type: ERROR_PUBLISHERS,
    meta
  }
}

function addToFilter(filters, name, filterName){
  let item = filters.get(name)
  if(item && item != ''){
    return '&' + filterName + '=' + item;
  }
  return ''
}


export function fetchPublishers(ordering, filters) {
  return function (dispatch) {

    dispatch(requestPublishers())
    
    var filter_addition = '';
    if(filters != undefined){
      filter_addition += addToFilter(filters, 'publisher', 'publisher_ref')
      filter_addition += addToFilter(filters, 'publisherName', 'publisher_name')
    }

    let meta = immutable.Map({
      'filters': filters,
      'order': ordering,
      'count': 1,
      'filterChangeTime': filters.get('filterChangeTime'),
      'loading': false
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