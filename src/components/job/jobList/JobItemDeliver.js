import React, { Component, PropTypes } from 'react';
import * as JobHelper from '../../../helpers/jobHelper';
import { Link } from 'react-router';

export default class JobItem extends Component {
  render() {
    let item = this.props.data;
    return (
      <Link to={'/job/' + item.job.id} className="job-item">
        <div className="job-item__top">
          <div className="job-item__info">
            <h2 className="job-item__title">{item.job.title}</h2>
            {JobHelper.getJobType(item.job)}

            <p className="job-item__update">{item.job.refreshAtH5}</p>
          </div>

          <div className="job-item__content">
            <p className="job-item__company">{item.job.companyName}</p>
            <p className="job-item__status">{item.stateDesc.value}</p>
          </div>
        </div>
      </Link>
    );
  }
}

JobItem.propTypes = {
  data: PropTypes.object.isRequired
};
