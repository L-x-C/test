import * as JobActions from '../actions/jobActions';
import isEmpty from 'lodash/isEmpty';
import APIS_JOB from '../constants/ApiUrls_job';
import {isClient, appendParam} from '../helpers/location';
import {dot, SmartDisPatch} from '../helpers/';

export function enterJobCompany(store) {
  return (nextState) => {
    const {companyId} = nextState.params;
    SmartDisPatch(store, JobActions.fetchCompanyInfo(companyId));
  };
}

export function enterJobInfo(store) {
  return (nextState) => {
    tryRefreshForApp(nextState);

    const {jobId} = nextState.params;
    SmartDisPatch(store, JobActions.fetchJobInfo(jobId));
  };
}

export function enterJobList(store) {
  return (nextState, replace) => {
    if (!nextState.location.query.sort && nextState.location.pathname === '/job/list') {
      return replace('/job/list?sort=1&sortStr=最新');
    }

    SmartDisPatch(store, JobActions.fetchListInfo(nextState.location.query));
  };
}

export function enterJobSearch(store) {
  return (nextState) => {
    (!isEmpty(nextState.location.query) || nextState.location.pathname !== '/job/search') && SmartDisPatch(store, JobActions.fetchListInfo(nextState.location.query));
  };
}

export function enterJobFavorite(store) {
  return (nextState) => {
    SmartDisPatch(store, JobActions.fetchJobListScroll(APIS_JOB.fetchFavorite(), nextState.location.query, store.getState().cookie));
  };
}

export function enterJobDeliver(store) {
  return (nextState) => {
    SmartDisPatch(store, JobActions.fetchJobListScroll(APIS_JOB.fetchApplication(), nextState.location.query, store.getState().cookie));
  };
}

function isAppClient() {
  return isClient() && window.navigator.userAgent.includes('QbtWebview');
}

function tryRefreshForApp(nextState) {
  const key = '_refreshed_';
  if (isAppClient() && (!dot(nextState, 'location', 'query', key))) {
    setTimeout(() => window.history.back(), 100);
    window.location.replace(appendParam(window.location.href, {[key]: true}));
  }
}


