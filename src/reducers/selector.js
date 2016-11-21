import * as ActionTypes from '../actions';
import { handleAction, handleActions } from 'redux-actions';
import initialState from './initialState';

export const selector = handleActions({
  [ActionTypes.LOAD_SELECTOR_DATA]: (state, action) => {
    return action.payload;
  }
}, initialState.selector);
