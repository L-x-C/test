import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import JobListScroll from '../../components/job/jobList/JobListScroll.js';
import * as actions from '../../actions/jobActions';
import * as toolBarActions from '../../actions/toolBarActions';
import APIS_JOB from '../../constants/ApiUrls_job';

class Favorite extends Component {
  componentWillMount() {
    this.props.toolBarActions.setToolBar({title: '收藏的职位', element: {type: 'link', url: '/job/list?sort=1&sortStr=最新', className: 'job-toolbar__list', title: '全部职位'}});
  }

  render() {
    return (
      <JobListScroll api={APIS_JOB.fetchFavorite()} selected={this.props.location.query} actions={this.props.actions} listInfoMoreEmpty={this.props.listInfoMoreEmpty} lastData={this.props.lastListInfo} data={this.props.listInfo}/>
    );
  }
}

function mapStateToProps(state) {
  return {
    lastListInfo: state.jobReducers.past[state.jobReducers.past.length - 1] ? state.jobReducers.past[state.jobReducers.past.length - 1].listInfo : [],
    listInfo: state.jobReducers.present.listInfo,
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
)(Favorite);

Favorite.propTypes = {
  actions: PropTypes.object.isRequired,
  toolBarActions: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  listInfoMoreEmpty: PropTypes.bool.isRequired,
  lastListInfo: PropTypes.array.isRequired,
  listInfo: PropTypes.array
};
