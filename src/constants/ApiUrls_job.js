import {CV_SERVER, JOB_SERVER} from '../../config.json';
import querystring from 'querystring';
import isEmpty from 'lodash/isEmpty';

export default {
  fetchJobInfo: function (jobId) {
    return `${JOB_SERVER}/job/${jobId}.json`;
  },
  fetchCompanyInfo: function (companyId) {
    return `${JOB_SERVER}/app/company/${companyId}.json`;
  },
  favorite: function(jobId) {
    return `${JOB_SERVER}/${jobId}/favorite.json`;
  },
  fetchCompanyJobList: function(companyId, opt) {
    let options = querystring.stringify(opt);
    return `${JOB_SERVER}/app/company/${companyId}/job.json?${options}`;
  },
  //职位列表页数据
  fetchListInfo: function(opt) {
    let obj = {};
    for (let i in opt) {
      if (i === 'city' || i === 'intention' || i === 'kind') {
        !obj['condition'] && (obj['condition'] = {});
        if (i === 'kind') {
          obj['condition'][i] = Number(opt[i]);   //实习,全职类型要传数字
        } else if (i === 'intention') {
          obj['condition'][i] = opt[i].split(',');  //职类要传数组
        } else {
          obj['condition'][i] = opt[i];
        }

      } else if (i === 'sort' || i === 'skip') {
        !obj['batch'] && (obj['batch'] = {});
        obj['batch'][i] = Number(opt[i]);
      } else if (i === 'keyword') {
        !obj['keyword'] && (obj['keyword'] = {});
        obj['keyword'] = opt[i];
      }
    }

    if (!isEmpty(obj.condition)) {
      obj.condition = JSON.stringify(obj.condition);
    }
    if (!isEmpty(obj.batch)) {
      obj.batch = JSON.stringify(obj.batch);
    }

    let options = '';
    if (isEmpty(obj.condition) && isEmpty(obj.batch) && !obj.keyword) {
      options = '';
    } else {
      options = querystring.stringify(obj);
    }
    return `${JOB_SERVER}/app/jobs.json?${options}`;
  },
  //热门搜索词
  fetchHotWords: function() {
    return `${JOB_SERVER}/app/search/hotwords.json`;
  },
  //获取收藏职位列表
  fetchFavorite: function() {
    return `${JOB_SERVER}/i/favorites.json`;
  },
  //获取投递列表
  fetchApplication: function() {
    return `${JOB_SERVER}/i/applications.json`;
  },
  //获取侧边栏个人信息
  fetchDrawerInfo: function() {
    return `${CV_SERVER}/account/current.json`;
  },
  //搜索联想词
  fetchJobSearchSuggestion: function(keyword) {
    return `${JOB_SERVER}/app/search/suggestion.json?word=${keyword}`;
  },
  //获取A4简历
  fetchResumes: function() {
    return `${JOB_SERVER}/account/careerAndResumes.json`;
  },
  //投递职位
  deliverJob: function(jobid) {
    return `${JOB_SERVER}/${jobid}/apply.json`;
  }
};
