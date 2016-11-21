import React, { Component, PropTypes } from 'react';
import DrawerMenu from '../drawerMenu/drawerMenu';
import SearchSuggestion from './SearchSuggestion';
import isEmpty from 'lodash/isEmpty';
import trim from 'lodash/trim';
import {browserHistory} from 'react-router';
import { Link } from 'react-router';
import './toolBar.scss';
import querystring from 'querystring';
import {isClient} from '../../helpers/location';

export default class ToolBar extends Component {
  state = {
    inputVal: '',
    showDrawer: false
  };

  componentWillReceiveProps(res) {
    this.setState({
      inputVal: res.data.keyword,
      showDrawer: false
    });
  }

  goBack = () => {
    if (this.props.data.onUndo) {
      this.props.data.onUndo();
    } else if (this.props.data.back) {
      this.props.data.back();
    } else {
      browserHistory.goBack();
    }
  };

  triggerDrawer = () => {
    this.setState({
      showDrawer: !this.state.showDrawer
    });
  };

  getLeft() {
    if (this.props.data.drawer) {
      return <a onClick={this.triggerDrawer} className={this.state.showDrawer ? 'icon-angle-left job-toolbar__back' : 'icon-menu job-toolbar__drawer_trigger'}> </a>;
    } else {
      return <a onClick={this.goBack} className="icon-angle-left job-toolbar__back"> </a>;
    }
  }

  getCenter() {
    if (this.props.data.title) {
      return <h1 className="job-toolbar__title">{this.props.data.title}</h1>;
    } else if (this.props.data.type === 'search') {
      return (
        <div className="job-toolbar__search">
          <span className="icon-search"> </span>
          <input ref="search_input" onKeyDown={this.onKeyDown} onChange={this.handleChange} value={this.state.inputVal || ''} type="text" className="job-toolbar__search_input"  placeholder="请输入职位或公司名称" />
        </div>
      );
    }
  }

  onKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.props.data.searchAction(this.refs.search_input.value);
      this.refs.search_input.blur();
    }
  };

  handleChange = (event) => {
    this.props.toolBarActions.setSearchKeyWord(event.target.value);

    if (this.props.data.handleChange && trim(event.target.value) !== '') {
      this.props.data.handleChange(event.target.value);
    } else if (this.props.data.handleChange && trim(event.target.value) === '') {
      this.props.toolBarActions.initSearchSuggestion();
    }
  };

  //渲染右上角的连接之类的东西
  renderElement(ele) {
    //红杉爸爸的特殊逻辑
    if (isClient() && querystring.parse(window.location.search.substr(1)).return === 'sequoia') {
      let url = window.location.pathname.indexOf('/c/') !== -1 ? 'http://www.qiaobutang.com/activity/sequoia/companies' : 'http://www.qiaobutang.com/activity/sequoia/jobs';
      return <a href={url} className="job-toolbar__list">全部职位</a>;
    }
    if (ele && ele.type === 'link') {
      if (ele.title === '全部职位') {
        return <Link to={ele.url} onClick={this.fetchNewestList} className="job-toolbar__list_all icon-uF007D" />;
      } else {
        return <Link to={ele.url} className={ele.className}>{ele.title}</Link>;
      }
    } else if (ele && ele.type === 'a') {
      return <a onClick={ele.onClick} className={ele.className}>{ele.title}</a>;
    } else {
      return null;
    }
  }

  fetchNewestList = () => {
    this.props.actions.fetchListInfo({sort: 1, sortStr: '最新'});
  };

  render() {
    let data = this.props.data;
    if (!isEmpty(data)) {
      return (
        <div className="job-toolbar__wrapper">
          <div className="job-toolbar">
            {this.getLeft()}
            {data.drawer && <DrawerMenu showDrawer={this.state.showDrawer} toolBarActions={this.props.toolBarActions} drawerMenuInfo={this.props.drawerMenuInfo}/>}
            {this.props.searchSuggestion.length !== 0 && <SearchSuggestion toolBarActions={this.props.toolBarActions} searchAction={this.props.data.searchAction} data={this.props.searchSuggestion} />}

            {this.getCenter()}

            {this.props.data.element && this.renderElement(this.props.data.element)}
          </div>
        </div>
      );
    } else {
      return null;
    }

  }
}

ToolBar.propTypes = {
  data: PropTypes.object,
  toolBarActions: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  drawerMenuInfo: PropTypes.object.isRequired,
  searchSuggestion: PropTypes.array
};
