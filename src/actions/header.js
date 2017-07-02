export const SET_TAB_OPTIONS = 'SET_TAB_OPTIONS'
export const SET_PAGE_TITLE = 'SET_PAGE_TITLE'


export function setTabOptions(tabs) {
  return {
    type: SET_TAB_OPTIONS,
    tabs
  }
}


export function setPageTitle(title) {
  return {
    type: SET_PAGE_TITLE,
    title
  }
}


