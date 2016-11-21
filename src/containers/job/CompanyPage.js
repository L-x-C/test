import React, { Component, PropTypes } from 'react';
import Company from '../../components/job/company/Company.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/jobActions';
import * as toolBarActions from '../../actions/toolBarActions';
import { ActionCreators as UndoActionCreators } from 'redux-undo';
import PageLoading from '../../components/job/pageLoading/PageLoading.js';
import isEmpty from 'lodash/isEmpty';

class CompanyPage extends Component {
  render() {
    if (isEmpty(this.props.companyInfo)) {
      return (
        <PageLoading />
      );
    } else {
      let mode = this.props.location.pathname.split('/')[2];
      return (
        <Company mode={mode} data={this.props.companyInfo} onUndo={this.props.onUndo} actions={this.props.actions} toolBarActions={this.props.toolBarActions}/>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    companyInfo: state.jobReducers.present.companyInfo
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    toolBarActions: bindActionCreators(toolBarActions, dispatch),
    onUndo: () => dispatch(UndoActionCreators.undo())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompanyPage);


CompanyPage.propTypes = {
  params: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  toolBarActions: PropTypes.object.isRequired,
  companyInfo: PropTypes.object.isRequired,
  onUndo: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired
};
