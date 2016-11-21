import { createFetchTypesAndFuncs } from './utils';
import { createAction } from 'redux-actions';
// action types分为两组：
// 1. saga用的
// 2. dispatch用的。
// action函数使用来创建action creator的

const { CAREER, career } = createFetchTypesAndFuncs('career');
const { MY_CAREER, myCareer } = createFetchTypesAndFuncs('my_career');
const { COMMENTS, comments } = createFetchTypesAndFuncs('comments');

export {
  CAREER,
  career,
  MY_CAREER,
  myCareer,
  COMMENTS,
  comments
};


// action types
export const LOAD_UID = 'LOAD_UID';
export const LOAD_CAREER = 'LOAD_CAREER';
export const LOAD_MY_CAREER = 'LOAD_MY_CAREER';
export const LOAD_COMMENTS = 'LOAD_COMMENTS';

export const EDIT_CAREER = 'EDIT_CAREER';
export const DEL_CAREER_ITEM = 'DEL_CAREER_ITEM';
export const LOAD_EDIT_TYPE = 'LOAD_EDIT_TYPE';
export const LOAD_EDIT_DATA = 'LOAD_EDIT_DATA';

export const LOAD_SELECTOR_DATA = 'LOAD_SELECTOR_DATA';
export const PREPARE_SELECTOR_DATA = 'PREPARE_SELECTOR_DATA';

export const HANDLE_SELECTOR_CLICK = 'HANDLE_SELECTOR_CLICK';

// 供dispatch用
export const loadUID = createAction(LOAD_UID);
export const loadCareer = createAction(LOAD_CAREER);
export const loadComments = createAction(LOAD_COMMENTS);
export const loadMyCareer = createAction(LOAD_MY_CAREER);
export const loadEditType = createAction(LOAD_EDIT_TYPE);
export const loadEditData = createAction(LOAD_EDIT_DATA);
export const editCareer = createAction(EDIT_CAREER);
export const delCareerItem = createAction(DEL_CAREER_ITEM);
export const loadSelectorData = createAction(LOAD_SELECTOR_DATA);
export const prepareSelectorData = createAction(PREPARE_SELECTOR_DATA);

export const handleSelectorClick = createAction(HANDLE_SELECTOR_CLICK);
