import {take, call, put, fork} from 'redux-saga/effects';
import fetch from 'isomorphic-fetch';
import querystring from 'querystring';
import * as actions from '../actions/jobActions';
import * as toolBarActions from '../actions/toolBarActions';
import {CV_SERVER, JOB_SERVER} from '../../config.json';
import APIS_JOB from '../constants/ApiUrls_job';
import * as JOB_DROPDOWN_DATA from '../constants/Job_dropdown_data';
import {browserHistory} from 'react-router';

const value = true;

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    if (response.status === 500) {
      browserHistory.push('/500');
    }
    let error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function toJson(response) {
  return response.json();
}

//获得职位单页信息
export function* getJobInfo() {
  while (value) {
    const {jobId} = yield take('FETCH_JOB_INFO');
    yield put(actions.renderInitJobInfo());
    const jobInfoData = yield call(fetchJobInfo, jobId);
    if (jobInfoData.state) {
      yield put(actions.receiveJobInfo(jobInfoData.result));
    } else {
      browserHistory.push('/404');
    }
  }
}
function fetchJobInfo(jobId) {
  return fetch(APIS_JOB.fetchJobInfo(jobId), {
    credentials: 'include'
  }).then(checkStatus)
    .then(toJson)
    .then(function(data) {
    return data;
  });
}

//获得公司单页信息
export function* getCompanyInfo() {
  while (value) {
    const {companyId} = yield take('FETCH_COMPANY_INFO');
    const companyInfoData = yield call(fetchCompanyInfo, companyId);
    if (companyInfoData.resultCode === 200) {
      yield put(actions.receiveCompanyInfo(companyInfoData.result));
    } else {
      browserHistory.push('/404');
    }
  }
}
function fetchCompanyInfo(companyId) {
  return fetch(APIS_JOB.fetchCompanyInfo(companyId), {
    credentials: 'include'
  }).then(checkStatus)
    .then(toJson)
    .then(function(data) {
    return data;
  });
}

//收藏职位
export function* starJob() {
  while (value) {
    const {state, jobId} = yield take('STAR_JOB');
    const data = yield call(starJobFn, state, jobId);
    if (data.state) {
      yield put(actions.receiveStarJob(data));
    } else {
      if (data.result === '需要登录') {
        window.location.href = 'http://cv.qiaobutang.com/m/account/login?return=' + window.location.href;
      }
    }
  }
}
function starJobFn(state, jobId) {
  return fetch(APIS_JOB.favorite(jobId), {
    credentials: 'include',
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: querystring.stringify({
      state: state
    })
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
    return data;
  });
}

//获取公司对应职位列表
export function* getCompanyJobList() {
  while (value) {
    const {companyId, opt} = yield take('FETCH_COMPANY_JOB_LIST');
    const data = yield call(fetchCompanyJobList, companyId, opt);
    if (data.resultCode === 200) {
      yield put(actions.receiveCompanyJobList(data.result));
    } else {
      browserHistory.push('/404');
    }
  }
}
function fetchCompanyJobList(companyId, opt) {
  return fetch(APIS_JOB.fetchCompanyJobList(companyId, opt), {
    credentials: 'include'
  }).then(toJson)
    .then(function(data) {
    return data;
  });
}

//获取职位列表
export function* getListInfo() {
  while (value) {
    const {opt} = yield take('FETCH_LIST_INFO');
    yield put(actions.renderInit());
    const data = yield call(fetchListInfo, opt);
    if (data.resultCode === 200) {
      yield put(actions.receiveListInfo(data.result));
    } else {
      browserHistory.push('/404');
    }
  }
}
function fetchListInfo(opt) {
  return fetch(APIS_JOB.fetchListInfo(opt), {
    credentials: 'include'
  }).then(checkStatus)
    .then(toJson)
    .then(function(data) {
      return data;
    });
}

//获取加载更多职位列表
export function* getSkipListInfo() {
  while (value) {
    const {opt} = yield take('FETCH_SKIP_LIST_INFO');
    const data = yield call(fetchListInfo, opt);
    if (data.resultCode === 200) {
      yield put(actions.receiveSkipListInfo(data.result));
    } else {
      browserHistory.push('/404');
    }
  }
}

//获取职位列表下拉
export function* getDropdown() {
  while (value) {
    const {choose, mode} = yield take('FETCH_DROPDOWN');
    const data = yield call(fetchDropdown, choose ,mode);
    yield put(actions.receiveDropdown(data));
  }
}
function fetchDropdown(choose, mode) {
  switch(choose) {
    case 'location': {
      return JOB_DROPDOWN_DATA.location();
    }
    case 'category': {
      return JOB_DROPDOWN_DATA.category();
    }
    case 'kind': {
      return JOB_DROPDOWN_DATA.kind;
    }
    case 'sort': {
      return JOB_DROPDOWN_DATA.sort(mode);
    }
    default:
      return {};
  }
}
//预加载下拉组件数据
export function* getDropdownData() {
  while (value) {
    yield take('FETCH_DROPDOWN_DATA');
    yield call(fetchDropdownData);
  }
}
function fetchDropdownData() {
  JOB_DROPDOWN_DATA.location();
  JOB_DROPDOWN_DATA.category();
  JOB_DROPDOWN_DATA.sort();
}
//获得热门搜索词
export function* getHotWords() {
  while (value) {
    yield take('FETCH_HOT_WORDS');
    const data = yield call(fetchHotWords);
    if (data.resultCode === 200) {
      yield put(actions.receiveHotWords(data.result));
    } else {
      browserHistory.push('/404');
    }
  }
}
function fetchHotWords() {
  return fetch(APIS_JOB.fetchHotWords(), {
    credentials: 'include'
  }).then(checkStatus)
    .then(toJson)
    .then(function(data) {
      return data;
    });
}


//搜索
export function* getSearch() {
  while (value) {
    const {opt} = yield take('FETCH_SEARCH');
    const data = yield call(fetchListInfo, opt);
    if (data.resultCode === 200) {
      yield put(actions.receiveSearch(data.result));
    } else {
      browserHistory.push('/404');
    }
  }
}
//获取收藏,投递职位
export function* getJobListScroll() {
  while (value) {
    const {api, opts, cookie} = yield take('FETCH_JOB_LIST_SCROLL');
    yield put(actions.renderInit());
    const data = yield call(fetchJobListScroll, api, opts, cookie);
    if (data.result === '需要登录') {
      // browserHistory.push('/login');
      //TODO: 这里的跳转并不是一个特别好的解决办法,要想一个通用的跳转办法
      yield put(actions.redirect('login'));

      // window.location.href = 'http://cv.qiaobutang.com/m/account/login?return=' + window.location.href;
    } else {
      yield put(actions.receiveListInfo(data.result));
    }
  }
}
export function* getSkipJobListScroll() {
  while (value) {
    const {api, opts} = yield take('FETCH_SKIP_JOB_LIST_SCROLL');
    const data = yield call(fetchJobListScroll, api, opts);
    if (data.result === '需要登录') {
      window.location.href = 'http://cv.qiaobutang.com/m/account/login?return=' + window.location.href;
    } else {
      yield put(actions.receiveSkipListInfo(data.result));
    }
  }
}
function fetchJobListScroll(api, opts, cookie) {
  let newApi = opts ? api + '?' + querystring.stringify(opts) : api;
  let obj = {credentials: 'include'};
  if (cookie) {
    obj['headers'] = {Cookie: cookie};
  }
  return fetch(newApi, obj).then(checkStatus)
    .then(toJson)
    .then(function(data) {
      return data;
    });
}

//获取侧边栏个人信息
export function* getDrawerInfo() {
  while (value) {
    yield take('FETCH_DRAWER_INFO');
    const data = yield call(fetchDrawerInfo);
    yield put(toolBarActions.receiveDrawerInfo(data));
  }
}
function fetchDrawerInfo() {
  return fetch(APIS_JOB.fetchDrawerInfo(), {
    credentials: 'include'
  }).then(checkStatus)
    .then(toJson)
    .then(function(data) {
      return data;
    });
}


//搜索联想词
export function* getSearchSuggestion() {
  while (value) {
    let {api} = yield take('FETCH_SEARCH_SUGGESTION');
    const data = yield call(fetchSearchSuggestion, api);
    if (data.resultCode === 200) {
      yield put(toolBarActions.receiveSearchSuggestion(data.result));
    } else {
      browserHistory.push('/404');
    }
  }
}
function fetchSearchSuggestion(api) {
  return fetch(api, {
    credentials: 'include'
  }).then(checkStatus)
    .then(toJson)
    .then(function(data) {
      return data;
    });
}

//投递职位
export function* deliverJobTrigger() {
  while (value) {
    const {jobId} = yield take('DELIVER_JOB_Trigger');
    let hasCV = yield call(hasCVFn);
    if (hasCV.state) {
      if (hasCV.result.resumes && hasCV.result.resumes.length !== 0) {
        //有简历
        yield put(actions.receiveCV(hasCV.result.resumes));
      } else {
        browserHistory.push(`/career?isPost=true&jobId=${jobId}`);
      }
    } else {
      if (hasCV.result === '需要登录') {
        window.location.href = 'http://cv.qiaobutang.com/m/account/login?return=' + window.location.href;
      }
    }
  }
}
function hasCVFn() {
  return fetch(APIS_JOB.fetchResumes(), {
    credentials: 'include'
  }).then(checkStatus)
    .then(toJson)
    .then(function(data) {
      return data;
    });
}

export function* deliverJob() {
  while (value) {
    let {jobid, cvid, onboard} = yield take('DELIVER_JOB');
    let result = yield call(deliverJobFn, jobid, cvid, onboard);
    yield put(actions.initCV());
    if (result.state) {
      yield put(actions.hasDelivered());
    }
    if (onboard) {
      browserHistory.goBack();
    }
  }
}
function deliverJobFn(jobid, cvid, onboard) {
  //投简历
  return fetch(APIS_JOB.deliverJob(jobid), {
    credentials: 'include',
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: querystring.stringify({
      resumeId: cvid,
      onboard,
      letter: ''
    })
  }).then(checkStatus)
    .then(toJson)
    .then(function(data) {
      return data;
    });
}
