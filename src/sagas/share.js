import {take, call, put, fork} from 'redux-saga/effects';
import fetch from 'isomorphic-fetch';
import {CV_SERVER} from '../../config.json';

const value = true;

//获得职位单页信息
export function* setShare() {
  while (value) {
    const {data} = yield take('SET_SHARE');
    if (data.wx && isWx()) {
      yield call(configWx, data.wx);
    }
  }
}
function configWx(wxObj) {
  //微信分享
  fetch(`${CV_SERVER}/weixin/js/sdk.json?url=` + encodeURIComponent(location.href), {
    credentials: 'include'
  }).then(function(response) {
    return response.json();
  }).then(function(res) {
    window.wx.config({
      appId: res.appid,
      timestamp: res.timeStamp,
      nonceStr: res.nonceString,
      signature: res.signature,
      jsApiList: [
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ'
      ]
    });

    window.wx.ready(function () {
      window.wx.onMenuShareTimeline(wxObj);
      window.wx.onMenuShareAppMessage(wxObj);
      window.wx.onMenuShareQQ(wxObj);
    });
  });
}


//判断是否是微信
function isWx(){
  let ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i)) {
    return true;
  } else {
    return false;
  }
}
