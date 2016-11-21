import objectAssign from 'object-assign';

const INITIAL_STATE = {
  toolBarData: {},
  drawerMenuInfo: {},
  searchSuggestion: []
};

export function toolBar(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_TOOLBAR':
      return objectAssign({}, state, {toolBarData: action.data, searchSuggestion: []});
    case 'RECEIVE_DRAWER_INFO':
      return objectAssign({}, state, {drawerMenuInfo: action.data, searchSuggestion: []});
    case 'RECEIVE_SEARCH_SUGGESTION':
      return objectAssign({}, state, {searchSuggestion: action.data});
    case 'INIT_SEARCH_SUGGESTION':
      return objectAssign({}, state, {searchSuggestion: []});
    case 'SET_SEARCH_KEYWORD': {
      let tempObj = objectAssign({}, state.toolBarData, {keyword: action.data});
      let obj = objectAssign({}, state, {toolBarData: tempObj});
      return obj;
    }
    default:
      return state;
  }
}
