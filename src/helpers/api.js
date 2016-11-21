// 从api获取的数据在这里进行相关格式化
import axios from 'axios';
import querystring from 'querystring';
import assign from 'lodash/assign';
import {CV_SERVER, WWW_SERVER} from '../../config.json';

function getAxiosConfig(url, formData) {
  const baseConfig = {
    url,
    method: 'GET',
    withCredentials: true
  };
  if (!formData) {
    return baseConfig;
  }
  return assign(baseConfig, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: querystring.stringify(formData)
  });
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    // 不规范的返回结果http://cv.qiaobutang.com/career/skills/category.json
    return response.data;
  } else {
    let error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

// TODO: 如果json解析出错了怎么办
// 返回{ response, error }
// 非200同一输出failureCause
function callApi(url, data) {
  const config = getAxiosConfig(url, data);
  return axios(config).then(checkStatus)
    .then((response) => {
      if (response.resultCode && response.resultCode !== 200) {
        let error = new Error(response.failureCause);
        throw error;
      } else {
        return { response };
      }
    })
    .catch((error) => ({ error: error.message || '出错啦！！！' }));
}

export const fetchCareer = (uid) => callApi(`${CV_SERVER}/m/career/${uid}/section.json`);
// 返回结果中如果有needLogin则需要跳转到登录页面。
export const fetchMyCareer = () => callApi(`${CV_SERVER}/m/career/section.json`);
export const fetchComments = (uid) => callApi(`${CV_SERVER}/connection/${uid}/evaluations.json`);
export const fetchUID = () => callApi(`${CV_SERVER}/current/account_id.json`);

export const fetchProvinces = () => callApi(`${CV_SERVER}/api/province.json`);
export const fetchCities = (provinceCode) => callApi(`${CV_SERVER}/api/province/cities/${provinceCode}.json`);
export const fetchUniversities = (provinceCode) => callApi(`${CV_SERVER}/api/province/universities/${provinceCode}.json`);
export const fetchColleges = (code) => callApi(`${CV_SERVER}/api/province/university/colleges/${code}.json`);
export const fetchCountries = () => callApi(`${WWW_SERVER}/university_choice/foreign.json`);
export const fetchForeignUniversities = (countryId) => callApi(`${WWW_SERVER}/university_choice/foreign/college.json?countryId=${countryId}`);

export const editCareerItem = (data) => callApi(`${CV_SERVER}/m/career/section/edit.json?v=5`, data);
export const addCareerItem = (data) => callApi(`${CV_SERVER}/m/career/section/add.json?v=5`, data);
export const delCareerItem = (data) => callApi(`${CV_SERVER}/m/career/section/delete.json?v=5`, data);
