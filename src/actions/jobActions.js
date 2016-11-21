//获得职位单页信息
export function fetchJobInfo(jobId) {
  return {
    type: 'FETCH_JOB_INFO',
    jobId
  };
}

export function receiveJobInfo(result) {
  return {
    type: 'RECEIVE_JOB_INFO',
    result
  };
}

//获得公司单页信息
export function receiveCompanyInfo(result) {
  return {
    type: 'RECEIVE_COMPANY_INFO',
    result
  };
}

export function fetchCompanyInfo(companyId) {
  return {
    type: 'FETCH_COMPANY_INFO',
    companyId
  };
}

//职位单页收藏职位
export function starJob(state, jobId) {
  return {
    type: 'STAR_JOB',
    state,
    jobId
  };
}
export function receiveStarJob(data) {
  return {
    type: 'RECEIVE_STAR_JOB',
    data
  };
}

//获取公司对应的职位列表
export function fetchCompanyJobList(companyId, opt) {
  return {
    type: 'FETCH_COMPANY_JOB_LIST',
    companyId,
    opt
  };
}
export function receiveCompanyJobList(result) {
  return {
    type: 'RECEIVE_COMPANY_JOB_LIST',
    result
  };
}

export function renderInit() {
  return {
    type: 'RENDER_INIT'
  };
}
export function renderInitJobInfo() {
  return {
    type: 'RENDER_INIT_JOB_INFO'
  };
}

//获取职位列表页
export function fetchListInfo(opt) {
  return {
    type: 'FETCH_LIST_INFO',
    opt
  };
}
export function receiveListInfo(result) {
  return {
    type: 'RECEIVE_LIST_INFO',
    result
  };
}

//获取加载更多职位列表页
export function fetchSkipListInfo(opt) {
  return {
    type: 'FETCH_SKIP_LIST_INFO',
    opt
  };
}
export function receiveSkipListInfo(result) {
  return {
    type: 'RECEIVE_SKIP_LIST_INFO',
    result
  };
}

//获取职位列表页下拉选项
export function fetchDropdown(choose, mode) {
  return {
    type: 'FETCH_DROPDOWN',
    choose,
    mode
  };
}
//预加载下拉组件数据
export function fetchDropdownData() {
  return {
    type: 'FETCH_DROPDOWN_DATA'
  };
}
export function receiveDropdown(result) {
  return {
    type: 'RECEIVE_DROPDOWN',
    result
  };
}

//获得热门搜索词
export function fetchHotWords() {
  return {
    type: 'FETCH_HOT_WORDS'
  };
}
export function receiveHotWords(result) {
  return {
    type: 'RECEIVE_HOT_WORDS',
    result
  };
}

//获得收藏职位,获得投递职位
export function fetchJobListScroll(api, opts, cookie) {
  return {
    type: 'FETCH_JOB_LIST_SCROLL',
    api,
    opts,
    cookie
  };
}
export function fetchSkipJobListScroll(api, opts) {
  return {
    type: 'FETCH_SKIP_JOB_LIST_SCROLL',
    api,
    opts
  };
}

//投递职位
export function deliverJobTrigger(jobId) {
  return {
    type: 'DELIVER_JOB_Trigger',
    jobId
  };
}
export function receiveCV(result) {
  return {
    type: 'RECEIVE_CV',
    result
  };
}
export function deliverJob(jobid, cvid, onboard) {
  return {
    type: 'DELIVER_JOB',
    jobid,
    cvid,
    onboard
  };
}
export function initCV() {
  return {
    type: 'INIT_CV'
  };
}
export function hasDelivered() {
  return {
    type: 'HAS_DELIVERED'
  };
}

export function redirect(path) {
  return {
    type: 'REDIRECT',
    path
  };
}
