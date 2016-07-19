require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch'
import * as immutable from 'immutable'
import {oipaApiUrl} from '../config'

export const REQUEST_DATASETS = 'REQUEST_DATASETS'
function requestDatasets(meta) {
  return {
    type: REQUEST_DATASETS,
    meta,
    receivedAt: Date.now()
  }
}

export const RECEIVE_DATASETS = 'RECEIVE_DATASETS'
function receiveDatasets(meta, datasets) {
  return {
    type: RECEIVE_DATASETS,
    meta,
    datasets: immutable.List(datasets),
    receivedAt: Date.now()
  }
}

export const ADD_DATASETS = 'ADD_DATASETS'
function addDatasets(meta, datasets) {
  return {
    type: ADD_DATASETS,
    meta,
    datasets: immutable.List(datasets),
    receivedAt: Date.now()
  }
}

export const ERROR_DATASETS = 'ERROR_DATASETS'
function failedToFetchDatasets(meta){
	return {
		type: ERROR_DATASETS,
		meta,
		receivedAt: Date.now()
	}
}

export function fetchDatasets(page, ordering, filters) {
  return function (dispatch) {
    
    dispatch(requestDatasets(page))


    let filterChangeCounter = 0
    
    var filter_addition = '';
    if(filters != undefined){
      if(filters.get('filterChangeCounter') != undefined){
        filterChangeCounter = filters.get('filterChangeCounter')
      }

      let ref = filters.get('ref')
      if(ref != undefined && ref != ''){
        filter_addition += '&ref=' + ref;
      }

      let title = filters.get('title')
      if(title != undefined && title != ''){
        filter_addition += '&title=' + title;
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
      'page': page,
      'filters': filters,
      'order': ordering,
      'count': -1,
      'next': false,
      'previous': false,
      'filterChangeCounter': filterChangeCounter
    })
    
    return fetch(oipaApiUrl+`datasets/?page=`+page+`&format=json&page_size=200&ordering=`+ordering+`&fields=publisher,id,ref,title,type,source_url,date_updated,note_count`+filter_addition)
        .then((response) => {
      	if (response.status >= 400) {
            dispatch(failedToFetchDatasets(page))
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
            dispatch(addDatasets(meta, json.results))
          } else {
            dispatch(receiveDatasets(meta, json.results))
          }
      	}
      )
  }
}

