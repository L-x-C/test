import React, { Component, PropTypes } from 'react';
import JobItem from './JobItem';
import JobItemDeliver from './JobItemDeliver';
import './jobList.scss';

export default class JobList extends Component {
  render() {
    return (
      <div className="job-list">
        {!this.props.type && this.props.data && this.props.data.map((item) => {
          if (item.type) {
            if (item.type !== 'ad') {
              return <JobItem mode={this.props.mode} selected={this.props.selected} key={item.job.id} data={item.job} />;
            } else {
              return (
                <a href={item.ad.url} rel="nofollow" key={item.ad.url} className="job-item__ad">
                  <img className="job-item__adimg" src={item.ad.bannerPath} alt=""/>
                </a>
              );
            }
          } else {
            return <JobItem mode={this.props.mode} selected={this.props.selected} key={item.id} data={item} />;
          }
        })}

        {/*我投递的职位列表*/}
        {this.props.type === 'deliver' && this.props.data && this.props.data.map((item) => {
          return <JobItemDeliver key={item.job.id} data={item} />;
        })}
      </div>
    );
  }
}


JobList.propTypes = {
  data: PropTypes.array,
  type: PropTypes.string,
  selected: PropTypes.object,
  mode: PropTypes.string
};
