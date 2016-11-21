import React, { Component, PropTypes } from 'react';
import isEmpty from 'lodash/isEmpty';
import Helmet from "react-helmet";
import * as JobHelper from '../../../helpers/jobHelper';

import TagList from '../tagList/TagList.js';
import JobMore from '../jobMore/JobMore.js';
import JobList from '../jobList/JobList.js';
import FullScreenCarousel from '../fullScreenCarousel/FullScreenCarousel.js';

import '../../../styles/job/job.scss';
import imageCompany from '../../../images/job/company.png';

export default class Company extends Component {
  state = {
    fullScreenCarousel: false
  };

  componentWillMount() {
    let company = this.props.data || {};
    this.props.toolBarActions.setToolBar({title: company.name, element: {type: 'link', url: '/job/list?sort=1&sortStr=最新', className: 'job-toolbar__list', title: '全部职位'}});
  }

  componentDidMount() {
    let wxObj = this.getWxShare();
    this.props.toolBarActions.setShare({wx: wxObj});
  }

  componentDidUpdate() {
    let company = this.props.data || {};
    if (company.jobList) {
      let title = '';
      if (company.jobList[0].kind === 1) {
        title = `全职职位（${company.fulltimeVacancy}）`;
      } else {
        title = `实习职位（${company.internshipVacancy}）`;
      }
      this.props.toolBarActions.setToolBar({title: title, back: () => {this.props.onUndo();}});
    } else {
      this.props.toolBarActions.setToolBar({title: company.name, element: {type: 'link', url: '/job/list?sort=1&sortStr=最新', className: 'job-toolbar__list', title: '全部职位'}});
    }
  }

  getWxShare = () => {
    let company = this.props.data || {};

    let _title = `${company.name}正在火热招聘中-乔布招聘`;
    let _desc = `${company.introduction}`;
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

  triggerFullScreen = () => {
    this.setState({
      fullScreenCarousel: !this.state.fullScreenCarousel
    });
  };

  getJobList() {
    let company = this.props.data || {};
      return (
        <div className="job-company__job">
          {company.internshipVacancy !== 0 && <a onClick={() => this.props.actions.fetchCompanyJobList(company.id, {kind: 2, limit: company.internshipVacancy})} className="job-company__job_li">实习职位（{company.internshipVacancy}）</a>}
          {company.fulltimeVacancy !== 0 && <a onClick={() => this.props.actions.fetchCompanyJobList(company.id, {kind: 1, limit: company.fulltimeVacancy})} className="job-company__job_li">全职职位（{company.fulltimeVacancy}）</a>}
        </div>
      );
  }

  render() {
    let company = this.props.data || {};
    if (company.jobList) {
      return (
        <div>
          <Helmet title={company.name + '招聘信息_首页- 乔布招聘'}
                  meta={[
                    {"name": "keywords", "content": `${company.name},${company.name}招聘信息,${company.name}首页,乔布招聘`},
                    {"name": "description", "content": `查看${company.name}首页的招聘信息请上乔布招聘。`}
                  ]} />
          <div className="job-company__joblist">
            <JobList mode={this.props.mode} data={company.jobList}/>
          </div>
        </div>
      );
    } else {
      return (
        <div className="job-company">
          <Helmet title={company.name + '招聘信息_首页- 乔布招聘'}
                  meta={[
                    {"name": "keywords", "content": `${company.name},${company.name}招聘信息,${company.name}首页,乔布招聘`},
                    {"name": "description", "content": `查看${company.name}首页的招聘信息请上乔布招聘。`}
                  ]} />

          {this.state.fullScreenCarousel && <FullScreenCarousel pics={company.pictures} triggerFullScreen={this.triggerFullScreen} />}

          {company.pictures &&
          <div className="job-carousel__wrapper">
            <div className="job-carousel">
              <div className="item" onClick={this.triggerFullScreen}>
                <img src={company.pictures[0].thumbnail} alt=""/>
              </div>
            </div>


            <div className="job-carousel__tip">
              <span className="icon-uniE663">{company.pictures.length}张</span>
            </div>
          </div>}


          <div className="job-company__header">
            <div className="job-info__company_logo">
              <img src={company.logo || imageCompany} alt={company.detailName + 'logo'}/>
            </div>
            <div className="job-info__company_right">
              <p className="job-info__company_name">{company.detailName}</p>
              <p className="job-info__company_type">{company.kindName}/{company.scaleName}</p>
            </div>
          </div>

          {!isEmpty(company.tag) &&
          <div className="job-tag">
            <p className="icon-uniE77F">关键词</p>
          </div>}
          {!isEmpty(company.tag) && <TagList data={company.tag}/>}

          <div className="job-tag">
            <p className="icon-uniE612">公司简介</p>
          </div>
          <JobMore data={company.introduction}/>

          <div className="job-company__contact">
            {company.phone &&
            <div className="job-info__common">
              <p className="job-info__common_content icon-mobile">{company.phone}</p>
            </div>}
            {company.website &&
            <div className="job-info__common">
              <a href={company.website} rel="nofollow" className="job-info__common_content icon-uniE662">{company.website}</a>
            </div>}
            {company.weibo &&
            <div className="job-info__common">
              <a href={company.weibo} rel="nofollow" className="job-info__common_content icon-uniE620">{company.weibo}</a>
            </div>}
            {company.address &&
            <div className="job-info__common">
              <p className="job-info__common_content icon-location" onClick={() => {JobHelper.toBaidu(company.address);}}>{company.address}</p>
            </div>}
          </div>

          {this.getJobList()}

        </div>
      );
    }

  }
}

Company.propTypes = {
  actions: PropTypes.object.isRequired,
  toolBarActions: PropTypes.object,
  data: PropTypes.object.isRequired,
  onUndo: PropTypes.func.isRequired,
  mode: PropTypes.string
};
