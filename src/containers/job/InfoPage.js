import React, { Component, PropTypes } from 'react';
import Info from '../../components/job/info/Info.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/jobActions';
import * as toolBarActions from '../../actions/toolBarActions';
import PageLoading from '../../components/job/pageLoading/PageLoading.js';
import isEmpty from 'lodash/isEmpty';

class InfoPage extends Component {


  render() {
    if (isEmpty(this.props.jobInfo.job)) {
      return (
        <PageLoading />
      );
    } else {
      let mode = this.props.location.pathname.split('/')[2];
      mode = (mode === 'list' || mode === 'search') ? mode : '';
      return (
        <Info mode={mode} data={this.props.jobInfo} resumes={this.props.resumes} actions={this.props.actions} toolBarActions={this.props.toolBarActions}/>
      );
    }

  }
}

function mapStateToProps(state) {
  return {
    jobInfo: state.jobReducers.present.jobInfo,
    resumes: state.jobReducers.present.resumes
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
)(InfoPage);

InfoPage.propTypes = {
  params: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  toolBarActions: PropTypes.object.isRequired,
  jobInfo: PropTypes.object.isRequired,
  resumes: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired
};
