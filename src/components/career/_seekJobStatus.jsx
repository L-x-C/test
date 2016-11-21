import React, {Component, PropTypes} from 'react';
import {getSeekJobStatusString} from '../../helpers/dataStringMappings';
import editBlack from '../../images/edit-black.png';

class SeekJobStatusView extends Component {
  static propTypes = {
    jobId: PropTypes.string,
    objective: PropTypes.object,
    loadEditType: PropTypes.func,
    loadEditData: PropTypes.func,
    isEditable: PropTypes.bool
  }

  render() {
    const status = this.props.objective.seek_job_status;
    const statusString = getSeekJobStatusString(status);
    return (
      <div className="career-view__status">
        <div className="career-view__status-title">
          求职意向
        </div>
        <div className="career-view__status-edit" onClick={() => {
          this.props.loadEditData({type: 'objective', data: this.props.objective});
          this.props.loadEditType('objective');
        }}>
          {this.props.isEditable && <img src={editBlack}/>}
        </div>
        <div className="career-view__status-string">
          {statusString}
        </div>
      </div>
    );
  }
}

export default SeekJobStatusView;
