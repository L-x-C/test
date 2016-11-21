import { take, put, call, fork } from 'redux-saga/effects';
import { browserHistory } from 'react-router';
import * as actions from '../actions';

import * as careerSaga from './career';
import * as commonSaga from './common';
import * as jobSaga from './job';
import * as share from './share';


export default function* root() {
  yield [
    // job
    fork(jobSaga.getJobInfo),
    fork(jobSaga.getCompanyInfo),
    fork(jobSaga.getCompanyJobList),
    fork(jobSaga.getListInfo),
    fork(jobSaga.getSkipListInfo),
    fork(jobSaga.getDropdown),
    fork(jobSaga.getDropdownData),
    fork(jobSaga.getHotWords),
    fork(jobSaga.getSearch),
    fork(jobSaga.getJobListScroll),
    fork(jobSaga.getSkipJobListScroll),
    fork(jobSaga.getDrawerInfo),
    fork(jobSaga.getSearchSuggestion),
    fork(jobSaga.starJob),
    fork(jobSaga.deliverJobTrigger),
    fork(jobSaga.deliverJob),
    // career
    fork(careerSaga.watchLoadCareer),
    fork(careerSaga.watchLoadMyCareer),
    fork(careerSaga.watchLoadComments),
    fork(careerSaga.watchLogin),
    fork(careerSaga.watchEditCareer),
    fork(careerSaga.watchDelCareerItem),
    fork(careerSaga.watchLoadEditData),
    fork(commonSaga.watchPrepareSelectorData),
    fork(commonSaga.watchHandleSelectorClick),
    //分享
    fork(share.setShare)
  ];
}
