import React from 'react';
import {browserHistory} from 'react-router';
import querystring from 'querystring';
import objectAssign from 'object-assign';

export function salaryFormat(salary) {
  let salaryToK = salary / 1000;
  if (salary % 1000 !== 0) {
    if (salary % 100 !== 0) {
      return salaryToK.toFixed(0);
    } else {
      return salaryToK.toFixed(1);
    }
  } else {
    return salaryToK.toFixed(0);
  }
}

export function getSalary(data) {
  if (data.kind === 1) {
    if (data.salaryMin) {
      let smin = salaryFormat(data.salaryMin),
        smax = salaryFormat(data.salaryMax);
      return `￥${smin}K-${smax}K/月`;
    } else {
      return '面议';
    }
  } else {
    if (data.internshipSalary) {
      return `￥${data.internshipSalary}/天`;
    } else {
      return '面议';
    }
  }
}

export function getSalaryApp(data) {
  if (data.kind === 1) {
    return `￥${data.salaryString}`;
  } else {
    return `￥${data.internshipSalaryString}`;
  }
}

export function toBaidu(address) {
  let url = encodeURI(`http://api.map.baidu.com/geocoder?address=${address}&output=html`);
  window.location.href = url;
}

export function getJobType(data) {
  if (data.kind === 1) {
    return <span className="job-status">全职</span>;
  } else {
    return <span className="job-status job-status__bg">实习</span>;
  }
}

export function getBenefit(data) {
  let arr = [];
  if (data.benefit) {
    data.benefit.map((item) => {
      if (item.special === 1) {
        arr.push(item.tag);
      }
    });
  }
  return arr.join('/');
}

//把时间戳换成月-日
export function toMonthDay(timecode) {
  let dateDate = new Date(timecode),
      todayDate = new Date(),
      date = fixZero(dateDate.getMonth() + 1, 2) + "-" + fixZero(dateDate.getDate(), 2),
      today = fixZero(todayDate.getMonth() + 1, 2) + "-" + fixZero(todayDate.getDate(), 2);
  return date === today ? '今天' : date;
}
function fixZero(num, length) {
  let str = "" + num;
  let len = str.length;
  let s = "";
  for (let i = length; i-- > len;) {
    s += "0";
  }
  return s + str;
}

//用来处理搜索页不同条件的跳转
export function generateSearchUrl(queryUrl, obj) {
  let currentObj = querystring.parse(decodeURI(window.location.search).substr(1));
  for (let o in obj) {
    currentObj[o] = obj[o];
  }

  let url = '';
  for (let k in currentObj) {
    if (currentObj[k] !== '' && k !== 'skip') {
      url += k + '=' + currentObj[k] + '&';
    }
  }
  browserHistory.push(queryUrl + '?' + encodeURI(url.substring(0, url.length - 1)));
}

export function parseDefaultListQuery(obj) {
  return objectAssign({}, {sort: 1, sortStr: '最新'}, obj);
}
