require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch'
import * as immutable from 'immutable'
import {oipaApiUrl} from '../config'


export const REQUEST_DATASET = 'REQUEST_DATASET'
function requestDataset(datasetId) {
  return {
    type: REQUEST_DATASET,
    datasetId,
    receivedAt: Date.now()
  }
}

export const RECEIVE_DATASET = 'RECEIVE_DATASET'
function receiveDataset(datasetId, dataset) {
  return {
    type: RECEIVE_DATASET,
    datasetId,
    dataset: immutable.Map(dataset),
    receivedAt: Date.now()
  }
}

export const ERROR_DATASET = 'ERROR_DATASET'
function failedToFetchDataset(datasetId){
  return {
    type: ERROR_DATASET,
    datasetId,
    receivedAt: Date.now()
  }
}


export function fetchDataset(datasetId) {
  return function (dispatch) {

    dispatch(requestDataset(datasetId))

    return fetch(oipaApiUrl+`datasets/`+datasetId+`/?format=json`)
        .then((response) => {
        if (response.status >= 400) {
            dispatch(failedToFetchDataset(datasetId))
            return false;
        }
        return response.json();
      })
      .then((json) => {
          dispatch(receiveDataset(datasetId, json))
        }
      )
  }
}

export const REQUEST_DATASET_NOTES = 'REQUEST_DATASET_NOTES'
function requestDatasetNotes(datasetId, page) {
  return {
    type: REQUEST_DATASET_NOTES,
    datasetId,
    page,
    receivedAt: Date.now()
  }
}

export const RECEIVE_DATASET_NOTES = 'RECEIVE_DATASET_NOTES'
function receiveDatasetNotes(datasetId, meta, datasetNotes) {
  return {
    type: RECEIVE_DATASET_NOTES,
    datasetId,
    meta,
    datasetNotes: immutable.List(datasetNotes),
    receivedAt: Date.now()
  }
}

export const ADD_DATASET_NOTES = 'ADD_DATASET_NOTES'
function addDatasetNotes(datasetId, meta, datasetNotes) {
  return {
    type: ADD_DATASET_NOTES,
    datasetId,
    meta,
    datasetNotes: immutable.List(datasetNotes),
    receivedAt: Date.now()
  }
}

export const ERROR_DATASET_NOTES = 'ERROR_DATASET_NOTES'
function failedToFetchDatasetNotes(datasetId, page){
  return {
    type: ERROR_DATASET_NOTES,
    datasetId,
    page,
    receivedAt: Date.now()
  }
}

export function fetchDatasetNotes(datasetId, page, ordering) {
  return function (dispatch) {
    
    dispatch(requestDatasetNotes(datasetId, page))

    let meta = immutable.Map({
      'page': page,
      'order': ordering,
      'count': -1,
      'next': false,
      'previous': false,
      'filterChangeTime': Date.now()
    })
    
    return fetch(oipaApiUrl+`datasets/`+datasetId+`/notes/?page=`+page+`&format=json&page_size=200&ordering=`+ordering+`&fields=id,ref,title,type,source_url,date_updated,note_count`)
        .then((response) => {
        if (response.status >= 400) {
            dispatch(failedToFetchDatasetNotes(datasetId, page))
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
            dispatch(addDatasetNotes(datasetId, meta, json.results))
          } else {
            dispatch(receiveDatasetNotes(datasetId, meta, json.results))
          }
        }
      )
  }
}

export const REQUEST_DATASET_COMMON_ERRORS = 'REQUEST_DATASET_COMMON_ERRORS'
function requestDatasetCommonErrors(datasetId) {
  return {
    type: REQUEST_DATASET_COMMON_ERRORS,
    datasetId,
    receivedAt: Date.now()
  }
}

export const RECEIVE_DATASET_COMMON_ERRORS = 'RECEIVE_DATASET_COMMON_ERRORS'
function receiveDatasetCommonErrors(datasetId, results) {
  return {
    type: RECEIVE_DATASET_COMMON_ERRORS,
    datasetId,
    datasetCommonErrors: immutable.List(results),
    receivedAt: Date.now()
  }
}



export const ERROR_DATASET_COMMON_ERRORS = 'ERROR_DATASET_COMMON_ERRORS'
function failedToFetchDatasetCommonErrors(datasetId){
  return {
    type: ERROR_DATASET_COMMON_ERRORS,
    datasetId,
    receivedAt: Date.now()
  }
}

export function fetchDatasetCommonErrors(datasetId) {
  return function (dispatch) {
    
    dispatch(requestDatasetCommonErrors(datasetId))
    
    return fetch(oipaApiUrl+`datasets/aggregations/?format=json&group_by=model&aggregations=note_count&order_by=-note_count&id=`+datasetId)
        .then((response) => {
        if (response.status >= 400) {
            dispatch(failedToFetchDatasetCommonErrors(datasetId))
            return false;
        }
        return response.json();
      })
      .then((json) => {
          dispatch(receiveDatasetCommonErrors(datasetId, json.results))
        }
      )
  }
}

