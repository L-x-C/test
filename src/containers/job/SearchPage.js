import React, { Component, PropTypes } from 'react';
import Search from '../../components/job/search/Search.js';
import List from '../../components/job/list/List.js';
import isEmpty from 'lodash/isEmpty';
import indexOf from 'lodash/indexOf';
import APIS_JOB from '../../constants/ApiUrls_job';
import * as JobHelper from '../../helpers/jobHelper';
import {browserHistory} from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/jobActions';
import * as toolBarActions from '../../actions/toolBarActions';

let lastQuery = '',
    lastPathName = '';
class SearchPage extends Component {
  componentWillMount() {
    this.props.toolBarActions.setToolBar({type: 'search', keyword: this.props.location.query.keyword, searchAction: this.searchKeyWords, back: this.back, handleChange: this.handleChange, element: {type: 'link', url: '/job/list?sort=1&sortStr=最新', className: 'job-toolbar__list', title: '全部职位'}});
  }

  componentDidUpdate() {
    //url没变就不用发请求拿新数据了
    if (JSON.stringify(lastQuery) !== JSON.stringify(this.props.location.query) && !isEmpty(this.props.location.query) && lastPathName === this.props.location.pathname) {
      this.props.actions.fetchListInfo(this.props.location.query);
      this.props.actions.fetchDropdown();
    } else if (lastPathName !== this.props.location.pathname) {
      this.props.toolBarActions.setToolBar({type: 'search', keyword: this.props.location.query.keyword, searchAction: this.searchKeyWords, back: this.back, handleChange: this.handleChange, element: {type: 'link', url: '/job/list?sort=1&sortStr=最新', className: 'job-toolbar__list', title: '全部职位'}});
    }

    lastQuery = this.props.location.query;
    lastPathName = this.props.location.pathname;
  }

  //toolbar的返回
  back = () => {
    this.props.actions.renderInit();
    browserHistory.push('/job/list');
  };

  handleChange = (keyword) => {
    this.props.toolBarActions.fetchSearchSuggestion(APIS_JOB.fetchJobSearchSuggestion(keyword));
  };

  searchKeyWords = (keyword) => {
    if (keyword) {

      JobHelper.generateSearchUrl(this.props.location.pathname, {
        keyword: keyword
      });

      let search_logArr = JSON.parse(localStorage.getItem('search_log')) || [];
      if (indexOf(search_logArr, keyword) === -1) {
        search_logArr.unshift(keyword);
        localStorage.setItem('search_log', JSON.stringify(search_logArr));
      }

      this.props.toolBarActions.setToolBar({type: 'search', keyword: keyword, searchAction: this.searchKeyWords, back: this.back, handleChange: this.handleChange, element: {type: 'link', url: '/job/list?sort=1&sortStr=最新', className: 'job-toolbar__list', title: '全部职位'}});
    }
  };


  render() {
    if (isEmpty(this.props.listInfo) && isEmpty(this.props.location.query)) {
      return (
        <div>
          <Search searchKeyWords={this.searchKeyWords} pathname={this.props.location.pathname} search={this.props.search} actions={this.props.actions} toolBarActions={this.props.toolBarActions}/>
          {this.props.children}
        </div>
    );
    } else {
      return (
        <div>
          <List mode="search" listInfoMoreEmpty={this.props.listInfoMoreEmpty} loading={this.props.loading} pathname={this.props.location.pathname} selected={this.props.location.query} lastData={this.props.lastListInfo} data={this.props.listInfo} dropdownData={this.props.dropdown} actions={this.props.actions} toolBarActions={this.props.toolBarActions}/>
          {this.props.children}
        </div>
      );
    }

  }
}

function mapStateToProps(state) {
  return {
    search: state.jobReducers.present.search,

    lastListInfo: state.jobReducers.past[state.jobReducers.past.length - 1] ? state.jobReducers.past[state.jobReducers.past.length - 1].listInfo : [],
    listInfo: state.jobReducers.present.listInfo,
    dropdown: state.jobReducers.present.dropdown,
    loading: state.jobReducers.present.loading,
    listInfoMoreEmpty: state.jobReducers.present.listInfoMoreEmpty
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    toolBarActions: bindActionCreators(toolBarActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchPage);

SearchPage.propTypes = {
  params: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  listInfo: PropTypes.array.isRequired,
  search: PropTypes.object.isRequired,
  lastListInfo: PropTypes.array.isRequired,
  dropdown: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  listInfoMoreEmpty: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired,
  toolBarActions: PropTypes.object.isRequired,
  children: PropTypes.element
};
