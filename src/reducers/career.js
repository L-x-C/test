import * as ActionTypes from '../actions';
import {handleAction, handleActions} from 'redux-actions';
import initialState from './initialState';

export const career = handleActions({
  [ActionTypes.CAREER.REQUEST]: (state, action) => {
    return {};
  },
  [ActionTypes.CAREER.SUCCESS]: (state, action) => {
    return action.payload;
  },
  [ActionTypes.MY_CAREER.SUCCESS]: (state, action) => {
    const {needLogin} = action.payload;
    if (needLogin) {
      return {};
    } else {
      return action.payload;
    }
  }
}, initialState.career);

export const editType = handleActions({
  [ActionTypes.LOAD_EDIT_TYPE]: (state, action) => {
    return action.payload;
  }
}, initialState.editType);

export const editCache = handleActions({
  [ActionTypes.LOAD_EDIT_DATA]: (state, action) => {
    return action.payload;
  }
}, initialState.editCache);

export const uid = handleActions({
  [ActionTypes.LOAD_UID]: (state, action) => {
    return action.payload;
  },
  [ActionTypes.MY_CAREER.SUCCESS]: (state, action) => {
    if (action.payload.career) {
      return action.payload.career.profiles._id.replace(/^profiles-/, '') || '';
    }
    return '';
  }
}, initialState.uid);

export const comments = handleActions({
  [ActionTypes.COMMENTS.SUCCESS]: (state, action) => {
    return action.payload.evaluations;
  },
  [ActionTypes.CAREER.SUCCESS]: (state, action) => {
    return [];
  }
}, initialState.comments);
