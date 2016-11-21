import React, { Component, PropTypes } from 'react';
import './todayRecommend.scss';

export default class TodayRecommend extends Component {
  getDate() {
    return new Date().getDate();
  }
  getDay() {
    let day = new Date().getDay();
    switch (day) {
      case 0:
        return '天';
      case 1:
        return '一';
      case 2:
        return '二';
      case 3:
        return '三';
      case 4:
        return '四';
      case 5:
        return '五';
      case 6:
        return '六';
      default:
        return '天';
    }
  }

  handleClick() {
    if (window.confirm('下载APP，每天接收乔小编的精选优质岗位')) {
      window.location.href='http://cv.qiaobutang.com/app?from=collect';
    }
  }

  render() {
    return (
      <a onClick={this.handleClick} className="today-recommend">
        <div className="today-logo">
          <p className="today-logo__date">{this.getDate()}</p>
          <p className="today-logo__day">周{this.getDay()}</p>
        </div>

        <div className="today-content">
          <p className="today-title">今日精选职位</p>
          <p className="today-tip">名企、高薪、成长空间...</p>
          <p className="today-tip">乔小编每日为你精选优质岗位</p>
          <p className="today-number">9</p>
        </div>
      </a>
    );
  }
}

TodayRecommend.propTypes = {
};
