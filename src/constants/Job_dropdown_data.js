import fetch from 'isomorphic-fetch';
import filter from 'lodash/filter';
import {JOB_SERVER, CV_SERVER} from '../../config.json';
import {browserHistory} from 'react-router';

export const kind = {
  type: 'kind',
  single: true,
  data: [{
    fieldName: '不限',
    fieldValue: ''
  }, {
    fieldName: '全职',
    fieldValue: 1
  }, {
    fieldName: '实习',
    fieldValue: 2
  }]
};

export function location() {
  let localStorageCities = window.localStorage.getItem('dropdown_cities_v2');
  if (localStorageCities) {
    return {
      type: 'city',
      single: false,
      data: JSON.parse(localStorageCities)
    };
  } else {
    return fetch(`${CV_SERVER}/api/provinces.json`, {
      credentials: 'include'
    }).then(checkStatus)
      .then(toJson)
      .then(function(data) {
        data = sortLocation(data);
        window.localStorage.setItem("dropdown_cities_v2", JSON.stringify(data));//设置b为"isaac"
        return {
          type: 'city',
          single: false,
          data: data
        };
      });
  }
}

//排序,符合一个特定规则
function sortLocation(data) {
  let sortArr = ['云南', '湖南', '山东', '陕西', '四川', '福建', '浙江', '江苏', '广东', '上海', '北京'];

    sortArr.map((val_s, key_s) => {
      data.map((val_d, key_d) => {
        if (val_s === val_d.name) {
          let tempObj = data.splice(key_d, 1);
          data.unshift(tempObj[0]);
        }
      });
    });

  return data;
}

export function category() {
  let localStorageCategories = window.localStorage.getItem('dropdown_categories');
  if (localStorageCategories) {
    return {
      type: 'intention',
      single: false,
      data: JSON.parse(localStorageCategories)
    };
  } else {
    return fetch(`${JOB_SERVER}/misc/job.json`, {
      credentials: 'include'
    }).then(checkStatus)
      .then(toJson)
      .then(function(data) {
        window.localStorage.setItem("dropdown_categories", JSON.stringify(data.categories));//设置b为"isaac"
        return {
          type: 'intention',
          single: false,
          data: data.categories
        };
      });
  }
}

export function sort(mode) {
  let localStorageSort = JSON.parse(window.localStorage.getItem('dropdown_sorts'));
  if (mode === 'list') {
    //职位列表下,没有相关度
    localStorageSort = filter(localStorageSort, (o) => {
      return o.fieldName !== '相关度';
    });
  }
  if (localStorageSort) {
    return {
      type: 'sort',
      single: true,
      data: localStorageSort
    };
  } else {
    return fetch(`${JOB_SERVER}/app/misc/condition.json`, {
      credentials: 'include'
    }).then(checkStatus)
      .then(toJson)
      .then(function(data) {
        window.localStorage.setItem("dropdown_sorts", JSON.stringify(data.result.sort));//设置b为"isaac"
        return {
          type: 'sort',
          single: false,
          data: data.result.sort
        };
      });
  }
}

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
