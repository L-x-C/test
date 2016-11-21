import React, {Component, PropTypes, cloneElement} from 'react';
import {connect} from 'react-redux';
import {setToolBar, setShare} from '../../actions/toolBarActions';
import {loadComments, loadEditType, loadEditData} from '../../actions/index';
import {deliverJob} from '../../actions/jobActions';
import CareerView from '../../components/career/view.jsx';
import CareerEdit from './Edit.jsx';

import isEmpty from 'lodash/isEmpty';

class Career extends Component {
  static propTypes = {
    jobId: PropTypes.string,
    uid: PropTypes.string,
    drawerMenuInfo: PropTypes.object,
    career: PropTypes.object,
    editType: PropTypes.string,
    params: PropTypes.object,
    location: PropTypes.object,
    comments: PropTypes.array,
    loadComments: PropTypes.func,
    loadEditType: PropTypes.func,
    loadEditData: PropTypes.func,
    deliverJob: PropTypes.func,
    setShare: PropTypes.func,
    setToolBar: PropTypes.func
  };

  // edit通过url来判定。
  render() {
    const isEditable = !this.props.params.uid;
    const {isPost, jobId} = this.props.location.query;
    const {
      uid,
      comments,
      career,
      drawerMenuInfo,
      editType,
      setToolBar,
      setShare,
      loadComments,
      loadEditType,
      loadEditData,
      deliverJob
    } = this.props;
    const params = {
      isEditable,
      isPost,
      uid,
      comments,
      career,
      drawerMenuInfo,
      setToolBar,
      setShare,
      loadComments,
      loadEditType,
      loadEditData,
      deliverJob,
      jobId
    };
    return !isEmpty(this.props.career) && (
      editType ? <CareerEdit type={editType} jobId={jobId} /> : <CareerView {...params}/>
    );
  }
}

function mapStateToProps(state) {
  return {
    drawerMenuInfo: state.toolBar && state.toolBar.drawerMenuInfo,
    career: state.career,
    uid: state.uid,
    editType: state.editType,
    comments: state.comments
  };
}

// inject dispatch
export default connect(
  mapStateToProps,
  {setToolBar, setShare, loadComments, loadEditType, loadEditData, deliverJob}
)(Career);
