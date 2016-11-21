import objectAssign from 'object-assign';

const initialState = {
  jobInfo: {
    job: {},
    company: {},
    publisher: {},
    favorite: false
  },  //职位单页
  companyInfo: {},  //公司单页
  search: {
    hotWords: [],
    searchListInfo: [] //搜索职位列表页
  },
  listInfo: [], //职位列表页
  dropdown: {},  //下拉菜单
  loading: true,
  listInfoMoreEmpty: false,  //list页在上滑刷新时还能不能加载更多, false为能,true为不能,
  redirect: '',
  resumes: [] //简历列表
};

export default function jobInfo(state = initialState, action) {
  switch (action.type) {
    case 'RECEIVE_JOB_INFO': {
      let tempObj = objectAssign({}, state.jobInfo, action.result);
      let obj = objectAssign({}, state, {jobInfo: tempObj});
      return obj;
    }

    case 'RECEIVE_COMPANY_INFO':
      return objectAssign({}, state, {companyInfo: action.result});

    case 'RECEIVE_STAR_JOB': {
      let tempObj = objectAssign({}, state.jobInfo, {favorite: action.data.result});
      let obj = objectAssign({}, state, {jobInfo: tempObj});
      return obj;
    }

    case 'RECEIVE_COMPANY_JOB_LIST': {
      let tempObj = objectAssign({}, state.companyInfo, {jobList: action.result});
      let obj = objectAssign({}, state, {companyInfo: tempObj});
      return obj;
    }

    case 'RECEIVE_LIST_INFO': {
      return objectAssign({}, state, {listInfo: action.result, loading: false});
    }

    case 'RECEIVE_SKIP_LIST_INFO': {
      if (action.result.length !== 0) {
        let concatListInfo = state.listInfo.concat(action.result);
        return objectAssign({}, state, {listInfo: concatListInfo, loading: false});
      } else {
        return objectAssign({}, state, {listInfoMoreEmpty: true});
      }
    }

    case 'RECEIVE_DROPDOWN': {
      return objectAssign({}, state, {dropdown: action.result});
    }

    case 'RECEIVE_HOT_WORDS': {
      let tempObj = objectAssign({}, state.search, {hotWords: action.result});
      let obj = objectAssign({}, state, {search: tempObj});
      return obj;
    }

    case 'RECEIVE_CV': {
      return objectAssign({}, state, {resumes: action.result});
    }
    case 'HAS_DELIVERED': {
      let tempObj = objectAssign({}, state.jobInfo, {apply: true});
      let obj = objectAssign({}, state, {jobInfo: tempObj});
      return obj;
    }

    case 'RENDER_INIT':
      return initialState;

    case 'RENDER_INIT_JOB_INFO': {
      return objectAssign({}, state, {jobInfo: initialState.jobInfo});
    }
          
    case 'REDIRECT': {
      return objectAssign({}, state, {redirect: action.path});
    }

    case 'INIT_CV': {
      return objectAssign({}, state, {resumes: initialState.resumes});
    }

    default:
      return state;
  }
}

