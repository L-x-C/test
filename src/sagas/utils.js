import { put, call } from 'redux-saga/effects';

// resuable fetch Subroutine
// entity :  user | repo | starred | stargazers
// apiFn  : api.fetchUser | api.fetchRepo | ...
// data   : 请求的参数
export function* fetchEntity(entity, apiFn, data) {
  yield put(entity.request(data));
  const { response, error } = yield call(apiFn, data);
  if (response) {
    yield put(entity.success(response));
  } else {
    yield put(entity.failure(error));
  }
}
