import React, { Component, PropTypes } from 'react';
import {CV_SERVER, JOB_SERVER , LIVE_SERVER} from '../../../config.json';
import { Link } from 'react-router';
import './drawerMenu.scss';

export default class DrawMenu extends Component {
  componentWillMount() {
    this.props.toolBarActions.fetchDrawerInfo();
  }

  render() {
    let accountData = this.props.drawerMenuInfo;
    return (
      <div className={this.props.showDrawer ? 'page-drawer-menu show' : 'page-drawer-menu'}>
        <div className="page-drawer__inner">
          <div className="menu__nav">
            <a href={`${CV_SERVER}/m/`} className="menu-user-item">首页</a>
            <a href={`${CV_SERVER}/m/template/list`} className="menu-user-item">简历模板</a>
            <Link to="/job/list" className="menu-user-item">招聘信息</Link>
            <a href={`${LIVE_SERVER}?from=qbtmlist`} className="menu-user-item">职播宣讲</a>
            <a href={`${CV_SERVER}/post/579af8e50cf25bba0e4d5b8e?from=qbtmlist`} className="menu-user-item">热门校招</a>
            <a href={`${CV_SERVER}/help/getApp?from=m_nav`} rel="nofollow" className="menu-user-item">下载APP</a>
          </div>

          {accountData.needLogin &&
          <div className="sign-operate">
            <a href={`${CV_SERVER}/m/account/login`} className="sign-operate__btn">登录</a>
            <a href={`${CV_SERVER}/m/account/register`} className="sign-operate__btn">注册</a>
          </div>}

          {!accountData.needLogin &&
          <div className="user-info clearfix">
            <div className="title">
              <span className={'user-info__name icon-uniE646-1'}>{accountData.name}</span>
            </div>
            <div className="user-info__operate">
              <Link to="/job/delivery">
                投递记录
                <span className="right icon-angle-right"></span>
              </Link>
              <Link to="/job/favorite">
                收藏的职位
                <span className="right icon-angle-right"></span>
              </Link>
              <Link to="/career">
                编辑档案
                <span className="right icon-angle-right"></span>
              </Link>
              <a href={'http://www.qiaobutang.com/career/mobile_view?uid=' + accountData.id}>
                查看档案
                <span className="right icon-angle-right"></span>
              </a>
            </div>
            <a href={`${CV_SERVER}/m/logout`} className="sign-out">退出登录</a>
          </div>}
        </div>
      </div>
    );
  }
}

DrawMenu.propTypes = {
  toolBarActions: PropTypes.object.isRequired,
  drawerMenuInfo: PropTypes.object.isRequired,
  showDrawer: PropTypes.bool.isRequired
};
