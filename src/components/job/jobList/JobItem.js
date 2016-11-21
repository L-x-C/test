import React, { Component, PropTypes } from 'react';
import * as JobHelper from '../../../helpers/jobHelper';
import { Link } from 'react-router';
import {isClient} from '../../../helpers/location';
import querystring from 'querystring';

export default class JobItem extends Component {

  render() {
    let item = this.props.data,
      benefit = JobHelper.getBenefit(item),
      selected = this.props.selected || {},
      link = this.props.mode ? `/job/${this.props.mode}/${item.id}` : `/job/${item.id}`;
    if (isClient()) {
      let flag = querystring.parse(window.location.search.substr(1)).return;
      flag && (link += `?return=${flag}`);
    }
    return (
      <Link to={link} className="job-item">
        <div className="job-item__top">
          <div className="job-item__info">
            <h2 className="job-item__title">{item.title}</h2>
            {selected.kind ? '' : JobHelper.getJobType(item)}
            <p className="job-item__salary">{item.salaryString ? JobHelper.getSalaryApp(item) : JobHelper.getSalary(item)}</p>
          </div>

          <div className="job-item__content">
            <h3 className="job-item__company">{item.company ? item.company.name : item.companyName}</h3>
            <p className="job-item__update">{JobHelper.toMonthDay(item.refreshAt)}</p>
          </div>
        </div>

        <div className="job-item__bottom">
          <p className="job-item__bottom_list icon-uniE603">{item.city}</p>
          <p className="job-item__bottom_list icon-uniE6CC">{item.recruitmentNum ? item.recruitmentNum + '人' : '若干'}</p>
          {benefit && <p className="job-item__bottom_list icon-uniE62F">{benefit}</p>}
        </div>
      </Link>
    );
  }
}

JobItem.propTypes = {
  data: PropTypes.object.isRequired,
  selected: PropTypes.object,
  mode: PropTypes.string
};
