import React, { Component, PropTypes } from 'react';
import Helmet from "react-helmet";
import isEmpty from 'lodash/isEmpty';
import without from 'lodash/without';

import TagList from '../tagList/TagList.js';
import SearchList from '../searchList/SearchList.js';
import './../../../styles/job/job.scss';

export default class Search extends Component {
  state = {
    searchLog: []
  };

  componentWillMount() {
    this.props.actions.fetchHotWords();
    //要将搜索栏清空,并且把联想词也清空
    this.props.toolBarActions.initSearchSuggestion();
    this.props.toolBarActions.setSearchKeyWord('');
  }

  componentDidMount() {
    this.setState({
      searchLog: window.localStorage.getItem('search_log') ? JSON.parse(window.localStorage.getItem('search_log')) : []
    });
  }

  deleteLog = (item) => {
    let currentItems = this.state.searchLog;
    let newItems = without(currentItems, item);
    this.setState({
      searchLog: newItems
    });
    window.localStorage.setItem('search_log', JSON.stringify(newItems));
  };

  clearLog = () => {
    window.localStorage.setItem('search_log', '[]');
    this.setState({
      searchLog: []
    });
  };

  render() {
    let searchLog = this.state.searchLog;
    return (
      <div className="job-search">
        <Helmet title={'搜索职位 - 乔布简历'} />

        <div className="job-tag">
          <p>热门搜索</p>
        </div>
        <TagList onClick={this.props.searchKeyWords} data={this.props.search.hotWords}/>

        {!isEmpty(searchLog) &&
        <div className="job-tag">
          <p>搜索记录</p>
        </div>}
        {!isEmpty(searchLog) &&
        <div className="job-search__log">
          <SearchList onClick={this.props.searchKeyWords} data={this.state.searchLog} deleteLog={this.deleteLog} />
          <div onClick={this.clearLog} className="job-search__log_clear">清空记录</div>
        </div>}
      </div>
    );

  }
}

Search.propTypes = {
  actions: PropTypes.object.isRequired,
  toolBarActions: PropTypes.object.isRequired,
  searchKeyWords: PropTypes.func.isRequired,
  search: PropTypes.object.isRequired
};
