import React, { Component, PropTypes } from 'react';
import './toolBarBottom.scss';

export default class ToolBarBottom extends Component {
  getDeliver() {
    if (this.props.apply) {
      return (<div className="job-deliver job-deliver__no">已投递</div>);
    } else if (this.props.expired) {
      return (<span className="job-deliver job-deliver__no">已过期</span>);
    } else {
      return (<span onClick={() => this.props.actions.deliverJobTrigger(this.props.jobId)} className="job-deliver">立即投递</span>);
    }
  }

  render() {
    let props = this.props;
    return (
      <div className="job-toolbarbottom">
        <div onClick={() => props.actions.starJob(!props.favorite, props.jobId)} className={!props.favorite ? 'job-star icon-uniE618' : 'job-star icon-uniE69A'}></div>
        {this.getDeliver()}
      </div>
    );
  }
}

ToolBarBottom.propTypes = {
  expired: PropTypes.bool.isRequired,
  apply: PropTypes.bool.isRequired,
  jobId: PropTypes.number.isRequired,
  actions: PropTypes.object.isRequired
};
