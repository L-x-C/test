import {action} from './utils';

const SET_TOOLBAR = 'SET_TOOLBAR';

export const setToolBar = (data) => action('SET_TOOLBAR', {data});
export const fetchDrawerInfo = () => action('FETCH_DRAWER_INFO');
export const receiveDrawerInfo = (data) => action('RECEIVE_DRAWER_INFO', {data});
export const fetchSearchSuggestion = (api) => action('FETCH_SEARCH_SUGGESTION', {api});
export const receiveSearchSuggestion = (data) => action('RECEIVE_SEARCH_SUGGESTION', {data});
export const initSearchSuggestion = () => action('INIT_SEARCH_SUGGESTION');
export const setSearchKeyWord = (data) => action('SET_SEARCH_KEYWORD', {data});

export const setShare = (data) => action('SET_SHARE', {data});
