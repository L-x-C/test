import React, { Component, PropTypes } from 'react';
import List from '../../components/job/list/List.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/jobActions';
import * as toolBarActions from '../../actions/toolBarActions';
import {browserHistory} from 'react-router';
import * as JobHelper from '../../helpers/jobHelper';

let lastQuery = '',
    lastPathName = '';
class ListPage extends Component {
  componentWillMount() {
    this.props.toolBarActions.setToolBar({title: '乔布简历', element: {type: 'a', onClick: this.toolBarIconSearch, className: 'job-toolbar__right_icon icon-search'}, drawer: true});
  }

  componentDidUpdate() {
    //url没变就不用发请求拿新数据了
    if (JSON.stringify(lastQuery) !== JSON.stringify(this.props.location.query) && lastPathName === this.props.location.pathname) {
      this.props.actions.fetchListInfo(this.props.location.query);
      this.props.actions.fetchDropdown();
    } else if (lastPathName !== this.props.location.pathname && this.props.location.pathname === '/job/list') {
      this.props.toolBarActions.setToolBar({title: '乔布简历', element: {type: 'a', onClick: this.toolBarIconSearch, className: 'job-toolbar__right_icon icon-search'}, drawer: true});
    }

    lastQuery = this.props.location.query;
    lastPathName = this.props.location.pathname;
  }

  toolBarIconSearch = () => {
    this.props.actions.renderInit();
    browserHistory.push('/job/search');
  };

  render() {
    return (
      <div>
        <List mode="list" hasRecommend="true" listInfoMoreEmpty={this.props.listInfoMoreEmpty} loading={this.props.loading} pathname={this.props.location.pathname} selected={this.props.location.query} lastData={this.props.lastListInfo} data={this.props.listInfo} dropdownData={this.props.dropdown} actions={this.props.actions} toolBarActions={this.props.toolBarActions}/>
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
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
)(ListPage);

ListPage.propTypes = {
  params: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  toolBarActions: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  dropdown: PropTypes.object.isRequired,
  lastListInfo: PropTypes.array.isRequired,
  listInfo: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  listInfoMoreEmpty: PropTypes.bool.isRequired,
  children: PropTypes.element
};
