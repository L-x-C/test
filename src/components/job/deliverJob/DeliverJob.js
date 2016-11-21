import React, { Component, PropTypes } from 'react';
import {browserHistory} from 'react-router';
import './deliverJob.scss';

export default class DeliverJob extends Component {

  handleBgClick = (e) => {
    //点击在阴影部分让他消失
    if (e.target.className === 'deliver-popup') {
      this.props.actions.initCV();
    }
  };

  render() {
    return (
      <div className="deliver-popup" onClick={this.handleBgClick}>
        <div className="deliver-popup__wrapper">
          <div className="deliver-popup__title">请选择需要投递的简历</div>
          <div className="deliver-popup__list">
            <div className="deliver-popup__li deliver-popup__li_one">
              <p className="deliver-popup__li_title" onClick={()=>{
                  browserHistory.push(`/career?isPost=true&jobId=${this.props.jobId}`);
                }}>我的档案</p>
            </div>

            {this.props.resumes.map((val) => {
              return (
                <div className="deliver-popup__li" key={val.id} onClick={() => this.props.actions.deliverJob(this.props.jobId, val.id)}>
                  <p className="deliver-popup__li_title">{val.title}</p>
                  <p className="deliver-popup__li_time">{val.updateTime}</p>
                </div>
              );
            })}

          </div>
        </div>
      </div>
    );
  }
}

DeliverJob.propTypes = {
  actions: PropTypes.object.isRequired,
  jobId: PropTypes.number.isRequired,
  resumes: PropTypes.array
};
