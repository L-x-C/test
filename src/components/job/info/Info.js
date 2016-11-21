import React, { Component, PropTypes } from 'react';
import isEmpty from 'lodash/isEmpty';
import Helmet from "react-helmet";

import ToolBarBottom from '../toolBarBottom/ToolBarBottom.js';
import DeliverJob from '../deliverJob/DeliverJob.js';
import JobMore from '../jobMore/JobMore.js';
import TagList from '../tagList/TagList.js';

import * as JobHelper from '../../../helpers/jobHelper';
import { Link } from 'react-router';
import './../../../styles/job/job.scss';

import imageCompany from '../../../images/job/company.png';
import imageORZ from '../../../images/job/orz.png';
import {isClient} from '../../../helpers/location';
import querystring from 'querystring';

export default class Info extends Component {
  componentWillMount() {
    this.props.toolBarActions.setToolBar({title: this.props.data.job.title, element: {type: 'link', url: '/job/list?sort=1&sortStr=最新', className: 'job-toolbar__list', title: '全部职位'}});
  }

  componentDidMount() {
    let wxObj = this.getWxShare();
    this.props.toolBarActions.setShare({wx: wxObj});
  }

  getWxShare = () => {
    let job = this.props.data.job,
      salary = JobHelper.getSalary(job),
      city = this.getCity(),
      company = this.props.data.company;

    let _title = `${job.companyName}正在招聘${job.title}-乔布招聘`;
    let _desc = `工作地点：${city}
薪资：${salary}
发布时间：${job.refreshAtH5}`;
    let _imgUrl = company.logo || imageCompany;

    let wxObj = {
      title: _title,
      desc: _desc,
      link: location.href,
      imgUrl: _imgUrl,
      success: function () {},
      cancel: function () {}
    };
    return wxObj;
  };

  isFullTime() {
    if (this.props.data) {
      return this.props.data.job.kind === 1;
    }
  }

  getCompany() {
    let company = this.props.data.company,
        job = this.props.data.job;
    if (!isEmpty(company)) {
      let link = this.props.mode === '' ? `/job/c/${company.id}` : `/job/${this.props.mode}/c/${company.id}`;

      if (isClient()) {
        let flag = querystring.parse(window.location.search.substr(1)).return;
        flag && (link += `?return=${flag}`);
      }

      return (
        <Link to={link} className="job-info__company_full job-borderbottom">
          <div className="job-info__company_logo">
            <img src={company.logo || imageCompany} alt={company.name + 'logo'}/>
          </div>
          <div className="job-info__company_right">
            <p className="job-info__company_name">{company.name}</p>
            <p className="job-info__company_type">{company.kindName}/{company.scaleName}</p>
          </div>
        </Link>
      );
    } else {
      return (
        <div className="job-info__common">
          <p className="job-info__common_content icon-uniE647">{job.companyName}</p>
        </div>
      );
    }
  }

  getCity() {
    let job = this.props.data.job,
        cityName = job.cityName;
    if (cityName !== '全国') {
      let city = cityName.split('-')[0];
      if (city === '上海' || city === '北京' || city === '天津' || city === '重庆') {
        return city;
      } else {
        return job.city || city;
      }
    } else {
      return '全国';
    }
  }

  getExp() {
    let job = this.props.data.job;
    if (this.isFullTime()) {
      return (
        <div className="job-info__jd_list">
          <p className="job-info__jd_list_top">{job.workExperienceName || '经验不限'}</p>
          <p className="job-info__jd_list_bottom icon-uniE626">工作经验</p>
        </div>
      );
    } else {
      return (
        <div className="job-info__jd_list">
          <p className="job-info__jd_list_top">{job.internshipDay ?  job.internshipDay + '天/周' : '不限'}</p>
          <p className="job-info__jd_list_bottom icon-uniE626">实习时间</p>
        </div>
      );
    }
  }

  render() {
    let job = this.props.data.job,
        publisher = this.props.data.publisher;
    let salary = JobHelper.getSalary(job);
    return (
      <div className="job-info__wrapper">
        <Helmet title={`${job.companyName}-${job.address}${job.title} - 乔布招聘`}
                meta={[
                    {"name": "keywords", "content": `${job.title},${job.companyName},${job.companyName}招聘信息,${job.companyName}招聘${job.address}${job.title}`},
                    {"name": "description", "content": `${job.companyName}招聘${job.address}${job.title}，${salary}。乔布招聘提供最新最全的${job.address}${job.title}相关的职位信息要求，以及更多${job.address}${job.title}招聘信息要求。`}
                ]} />

        <div className="job-info__intro">
          <div className="job-info__preview job-borderbottom">
            <div className="job-info__preview_top">
              <h1 className="job-info__preview_title">{job.title}</h1>
              <p className="job-salary">{JobHelper.getSalary(job)}</p>
            </div>
            <div className="job-info__preview_bottom">
              {JobHelper.getJobType(job)}
              <span className="job-info__preview_publish">{job.refreshAtH5}</span>
            </div>
          </div>
          <div className="job-info__jd">
            <div className="job-info__jd_list">
              <p className="job-info__jd_list_top">{this.getCity()}</p>
              <p className="job-info__jd_list_bottom icon-uniE603">地点</p>
            </div>
            <div className="job-info__jd_list">
              <p className="job-info__jd_list_top">{job.recruitmentNum ? job.recruitmentNum + '人' : '若干'}</p>
              <p className="job-info__jd_list_bottom icon-uniE6CC">招聘人数</p>
            </div>
            <div className="job-info__jd_list">
              <p className="job-info__jd_list_top">{job.educationName}</p>
              <p className="job-info__jd_list_bottom icon-uniE666">学历</p>
            </div>
            {this.getExp()}
          </div>
        </div>

        <div className="job-info__company">
          {this.getCompany()}
          {job.internshipMonth &&
          <div className="job-info__common job-borderbottom">
            <p className="job-info__common_content icon-calendar">实习{job.internshipMonth}个月</p>
          </div>}
          {job.address &&
          <div className="job-info__common">
            <p className="job-info__common_content icon-uniE623" onClick={() => {JobHelper.toBaidu(job.address);}}>{job.address}</p>
          </div>}
        </div>

        <div className="job-tag">
          <p className="icon-uniE612">职位描述</p>
        </div>

        <JobMore data={job.content}/>

        <div className="job-tag">
          <p className="icon-uniE77F">职位类别</p>
        </div>
        <TagList data={job.categories}/>


        {job.skill &&
        <div className="job-tag">
          <p className="icon-uniE60F-1">技能要求</p>
        </div>}
        {job.skill && <TagList data={job.skill}/>}

        {!isEmpty(job.benefit) &&
        <div className="job-tag">
          <p className="icon-uniE744">职位福利</p>
        </div>}
        {!isEmpty(job.benefit) && <TagList data={job.benefit}/>}

        {job.major &&
        <div className="job-tag">
          <p className="icon-uniE6B9">专业要求</p>
        </div>}
        {job.major && <TagList data={job.majorList}/>}

        {!isEmpty(publisher) &&
        <div className="job-tag">
          <p className="icon-uniE61A">职位发布者</p>
        </div>}
        {!isEmpty(publisher) &&
        <Link to={'/career/' + job.accountId} className="job-info__publisher">
          <div className="job-info__publisher_avatar">
            <img src={publisher.avatar || imageORZ} alt=""/>
          </div>
          <div className="job-info__publisher_right">
            <p className="job-info__publisher_name">{publisher.careerName}</p>
            <p className="job-info__publisher_company">{job.companyName}</p>
          </div>
        </Link>}

        <ToolBarBottom actions={this.props.actions} apply={this.props.data.apply} resumes={this.props.resumes} favorite={this.props.data.favorite} expired={job.expired} jobId={job.id}/>

        {!isEmpty(this.props.resumes) &&
        <DeliverJob actions={this.props.actions} jobId={job.id} resumes={this.props.resumes} />}

      </div>
    );
  }
}

Info.propTypes = {
  data: PropTypes.object.isRequired,
  toolBarActions: PropTypes.object,
  actions: PropTypes.object.isRequired,
  resumes: PropTypes.array.isRequired,
  mode: PropTypes.string
};
