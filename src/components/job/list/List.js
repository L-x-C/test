import React, { Component, PropTypes } from 'react';
import Helmet from "react-helmet";
import ReactIScroll from 'react-iscroll';
import isEmpty from 'lodash/isEmpty';
import objectAssign from 'object-assign';

import JobList from '../jobList/JobList.js';
import TodayRecommend from '../todayRecommend/TodayRecommend';
import JobDropdown from '../jobDropdown/JobDropdown';

import './../../../styles/job/job.scss';
import imageLoading from '../../../images/loading.gif';
import imageNojob from '../../../images/job/no_job.png';
import imageLogo from '../../../images/logo_m.png';

let iScrollOptions = {
  mouseWheel: true,
  scrollbars: false,
  click: true,
  probeType: 2
};

let canRefresh = false;

export default class List extends Component {
  state = {
    locationActive: false,
    categoryActive: false,
    kindActive: false,
    sortActive: false,
    currentDropdown: '',
    iscrollInstance: null
  };

  componentDidMount() {
    this.initDropDownData();  //预加载下拉组件数据
    this.setState({
      iscrollInstance: require('iscroll/build/iscroll-probe')
    });
    let wxObj = this.getWxShare();
    this.props.toolBarActions.setShare({wx: wxObj});
  }

  componentWillUpdate() {
    this.refs.scrollMore.style.display = 'none';
    this.refs.scrollRefresh.style.display = 'none';
  }

  initDropDownData() {
    this.props.actions.fetchDropdownData();
  }

  getWxShare = () => {
    let wxObj = {
      title: '职位列表-乔布简历',
      desc: '乔布招聘是中国最大最好的招聘网站，为求职者提供2016年最新最全的招聘求职应聘信息，让求职招聘更加高效便捷地找到工作。同时，为企业提供最新最全的免费人才简历库，让企业招人不再那么难。',
      link: location.href,
      imgUrl: imageLogo,
      success: function () {},
      cancel: function () {}
    };
    return wxObj;
  };

  onScrollEnd = (iscroll) => {
    if (iscroll.directionY === 1 && iscroll.y === iscroll.maxScrollY  && this.refs.scrollMoreTip) {
      //上滑加载更多
      this.refs.scrollMore.style.display = 'block';
      this.refs.scrollRefresh.style.display = 'none';

      let currentSkip = this.props.data.length,
          currentQuery = this.props.selected;

      //把当前已有参数和加载更多参数合并
      let query = {};
      if (this.props.mode === 'list') {
        query = objectAssign({}, {sort: 1, sortStr: '最新'}, currentQuery, {skip: currentSkip});
      } else {
        query = objectAssign({}, currentQuery, {skip: currentSkip});
      }
      this.props.actions.fetchSkipListInfo(query);
    } else {
      this.refs.scrollRefresh.style.display = 'none';
      if (canRefresh) {
        let query = {};
        if (this.props.mode === 'list') {
          //职位列表页,刷新默认最新排序
          query = objectAssign({}, {sort: 1, sortStr: '最新'}, this.props.selected);
        } else {
          query = this.props.selected;
        }
        this.props.actions.fetchListInfo(query);
      }
    }
  };

  onScroll = (iscroll) => {
    canRefresh = false;
    if (iscroll.y > 0) {
      this.refs.scrollRefresh.innerHTML = '下拉更新';
      this.refs.scrollRefresh.style.display = 'block';

      if (iscroll.y > 50) {
        this.refs.scrollRefresh.innerHTML = '释放更新';
        canRefresh = true;
      }
    }
  };

  handleDrop = (type) => {
    //先把控制箭头的状态全置false
    this.setState({
      locationActive: false,
      categoryActive: false,
      kindActive: false,
      sortActive: false
    });

    //把当前选中的下拉的控制箭头的状态置反,并记录当前选中的是谁
    this.setState({
      [type + 'Active']: !this.state[type + 'Active'],
      currentDropdown: type
    });

    //如果当前选中的和指令一样,则消失
    if (type === this.state.currentDropdown) {
      this.disappearDropdown();
    } else {
      this.props.actions.fetchDropdown(type, this.props.mode);
    }
  };

  disappearDropdown = () => {
    this.props.actions.fetchDropdown();
    this.setState({
      locationActive: false,
      categoryActive: false,
      kindActive: false,
      sortActive: false,
      currentDropdown: ''
    });
  };

  getSkipNumber() {
    let skipNumber = 20;

    if (this.props.data.length !== 0) {
      for (let i = 0; i < this.props.data.length; i++) {
        if (this.props.data[i].type === 'ad') {
          skipNumber = 21;
          return skipNumber;
        }
      }
    }
    return skipNumber;
  }

  render() {
    return (
      <div>
        <Helmet title="中国最大最好的求职应聘|找工作|人才市场|职位信息网站 - 乔布招聘"
                meta={[
                    {"name": "keywords", "content": "找工作,求职,应聘,人才市场,面试,求职招聘网,乔布招聘"},
                    {"name": "description", "content": "乔布招聘是中国最大最好的招聘网站，为求职者提供2016年最新最全的招聘求职应聘信息，让求职招聘更加高效便捷地找到工作。同时，为企业提供最新最全的免费人才简历库，让企业招人不再那么难。"}
                ]} />

        <div className="job-dropdown__bar">
          <p className="job-dropdown__bar_list" onClick={() => {this.handleDrop('location');}}>
            <span className="job-dropdown__bar_content">{this.props.selected['cityStr'] && this.props.selected['cityStr'].split(',').pop() || '全国'}</span>
            <span className={this.state.locationActive ? 'active icon-angle-down' : 'icon-angle-down'}> </span>
          </p>
          <p className="job-dropdown__bar_list" onClick={() => {this.handleDrop('category');}}>
            <span className="job-dropdown__bar_content">{this.props.selected['intentionStr'] && this.props.selected['intentionStr'].split(',').pop() || '选择行业'}</span>
            <span className={this.state.categoryActive ? 'active icon-angle-down' : 'icon-angle-down'}> </span>
          </p>
          <p className="job-dropdown__bar_list" onClick={() => {this.handleDrop('kind');}}>
            <span className="job-dropdown__bar_content">{this.props.selected['kindStr'] || '不限'}</span>
            <span className={this.state.kindActive ? 'active icon-angle-down' : 'icon-angle-down'}> </span>
          </p>
          <p className="job-dropdown__bar_list" onClick={() => {this.handleDrop('sort');}}>
            <span className="job-dropdown__bar_content">{this.props.selected['sortStr'] || (this.props.mode === 'search' ? '相关度' : '最新')}</span>
            <span className={this.state.sortActive ? 'active icon-angle-down' : 'icon-angle-down'}> </span>
          </p>
        </div>

        {!isEmpty(this.props.dropdownData) && <JobDropdown mode={this.props.mode || ''} pathname={this.props.pathname} selected={this.props.selected} data={this.props.dropdownData} disappearDropdown={this.disappearDropdown} actions={this.props.actions}/>}
        {this.props.loading && <div className="iscroll-wrapper iscroll-wrapper__loading"><img src={imageLoading} alt=""/></div>}

        <div className="iscroll-wrapper">
          {this.state.iscrollInstance &&
          <ReactIScroll ref="iscroll" iScroll={this.state.iscrollInstance} options={iScrollOptions} onScroll={this.onScroll} onScrollEnd={this.onScrollEnd}>
            <div>
              <p ref="scrollRefresh" className="scroll-refresh__tip icon-spin4" style={{display: 'none'}}>下拉刷新</p>

              {this.props.hasRecommend && <TodayRecommend />}

              {this.props.data.length !== 0 ? <JobList mode={this.props.mode} data={this.props.data} selected={this.props.selected}/> : <div className="iscroll-wrapper__nojob"><img src={imageNojob} alt=""/><p className="nojob-tip">{this.props.mode === 'search' ? '没有找到搜索结果，试试其它关键词吧' : '没有找到职位，请尝试其它条件'}</p></div>}

              <p ref="scrollMore" className="scroll-more__tip icon-spin4" style={{display: 'none'}}>正在加载</p>

              {this.props.data.length >= this.getSkipNumber() && !this.props.listInfoMoreEmpty && <p ref="scrollMoreTip" className="scroll-more__tip">上滑加载</p>}
            </div>
          </ReactIScroll>}
          {!this.state.iscrollInstance &&
            <div>
              <p ref="scrollRefresh" className="scroll-refresh__tip icon-spin4" style={{display: 'none'}}>下拉刷新</p>

              {this.props.hasRecommend && <TodayRecommend />}

              {this.props.data.length !== 0 ? <JobList mode={this.props.mode} data={this.props.data} selected={this.props.selected}/> : <div className="iscroll-wrapper__nojob"><img src={imageNojob} alt=""/><p className="nojob-tip">{this.props.mode === 'search' ? '没有找到搜索结果，试试其它关键词吧' : '没有找到职位，请尝试其它条件'}</p></div>}

              <p ref="scrollMore" className="scroll-more__tip icon-spin4" style={{display: 'none'}}>正在加载</p>

              {this.props.data.length >= this.getSkipNumber() && !this.props.listInfoMoreEmpty && <p ref="scrollMoreTip" className="scroll-more__tip">上滑加载</p>}
            </div>}
        </div>
      </div>
    );
  }
}

List.propTypes = {
  toolBarActions: PropTypes.object,
  actions: PropTypes.object.isRequired,
  data: PropTypes.array,
  selected: PropTypes.object.isRequired,
  dropdownData: PropTypes.object.isRequired,
  pathname: PropTypes.string.isRequired,
  hasRecommend: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
  lastData: PropTypes.array.isRequired,
  listInfoMoreEmpty: PropTypes.bool.isRequired
};
