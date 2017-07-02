import * as tabActions from './actions/header'


function header(state = {tabs: [], pageTitle: ''}, action) {
  switch (action.type) {
    case tabActions.SET_TAB_OPTIONS:
      return {
        ...state,
        tabs: action.tabs
      }
    case tabActions.SET_PAGE_TITLE:
      return {
        ...state,
        pageTitle: action.title
      }
    default:
      return state
  }
}


const reducers =  {
    header,
}


export default reducers