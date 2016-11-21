import { take, put, call, fork, select } from 'redux-saga/effects';
import * as actions from '../actions';
import * as api from '../helpers/api';
import { getUID } from './selectors';
import { fetchEntity } from './utils';
import { login } from '../helpers/location';
import { destroy } from 'redux-form';
import initialState from '../reducers/initialState';

const fetchCareer = fetchEntity.bind(null, actions.career, api.fetchCareer);
const fetchMyCareer = fetchEntity.bind(null, actions.myCareer, api.fetchMyCareer);
const fetchComments = fetchEntity.bind(null, actions.comments, api.fetchComments);

function* loadCareer(uid) {
  yield call(fetchCareer, uid);
}

export function* watchLoadCareer() {
  while (true) {
    const { payload } = yield take(actions.LOAD_CAREER);
    yield fork(loadCareer, payload);
  }
}

function* loadMyCareer() {
  yield call(fetchMyCareer);
}

export function* watchLoadMyCareer() {
  while (true) {
    const action = yield take(actions.LOAD_MY_CAREER);
    yield fork(loadMyCareer);
  }
}

export function* watchLogin() {
  while (true) {
    const { payload } = yield take(actions.MY_CAREER.SUCCESS);
    // TODO: not trigger when ssr
    if (payload.needLogin) {
      login();
    }
  }
}

function* loadComments(uid) {
  yield call(fetchComments, uid);
}

export function* watchLoadComments() {
  while (true) {
    const action = yield take(actions.LOAD_COMMENTS);
    yield fork(loadComments, action.payload);
  }
}

function* editCareer(payload) {
  const { values, resolve, reject } = payload;
  const apiFunc = JSON.parse(values).data._id ? api.editCareerItem : api.addCareerItem;
  const { response, error } = yield call(apiFunc, { data: values });
  if (response) {
    resolve(response);
  } else {
    reject(error);
  }
}

export function* watchEditCareer() {
  while (true) {
    const action = yield take(actions.EDIT_CAREER);
    yield fork(editCareer, action.payload);
  }
}

function* delCareerItem(payload) {
  const { response, error } = yield call(api.delCareerItem, { data: JSON.stringify(payload) });
  if (response) {
    yield loadMyCareer();
    yield put(actions.loadEditType(initialState.editType));
  }
}

export function* watchDelCareerItem() {
  while (true) {
    const action = yield take(actions.DEL_CAREER_ITEM);
    yield fork(delCareerItem, action.payload);
  }
}

export function* watchLoadEditData() {
  while (true) {
    const action = yield take(actions.LOAD_EDIT_DATA);
    const {type} = action.payload;
    yield put(destroy(type));
  }
}
