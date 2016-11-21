import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import isEmpty from 'lodash/isEmpty';
import compact from 'lodash/compact';
import ProfileView from './_profile.jsx';
import SeekJobStatusView from './_seekJobStatus.jsx';
import ItemListView from './_itemList.jsx';
import PostBarView from './_postBar.jsx';
import TagView from './_tags.jsx';
import CommentView from './_comment.jsx';
import {dot} from '../../helpers';
import {CV_SERVER} from '../../../config.json';

// 1. 普通的展示页（不带求职意向），有评论，有好友
// 2. 编辑页，有求职意向，有投递，有预览

class CareerView extends Component {
  static propTypes = {
    isEditable: PropTypes.bool,
    isPost: PropTypes.string,
    jobId: PropTypes.string,
    career: PropTypes.object,
    drawerMenuInfo: PropTypes.object,
    comments: PropTypes.array,
    setToolBar: PropTypes.func,
    setShare: PropTypes.func,
    loadComments: PropTypes.func,
    loadEditType: PropTypes.func,
    loadEditData: PropTypes.func,
    deliverJob: PropTypes.func,
    uid: PropTypes.string
  }

  componentWillMount() {
    this.setToolBar();
  }

  componentDidMount() {
    const wxObj = this.getWxShare();
    this.props.setShare({wx: wxObj});
  }

  componentDidUpdate(nextProps, nextState) {
    this.setToolBar();
  }

  setToolBar() {
    const title = this.getPageTitle(this.getSegment('profiles', 0).name);
    const toolBar = {title};
    if (this.props.isPost && this.props.isEditable) {
      toolBar.element = {
        type: 'a',
        title: '预览',
        className: 'job-toolbar__right_text',
        onClick() {
          window.location.href = `${CV_SERVER}/employee/preview`;
        }
      };
    }
    this.props.setToolBar(toolBar);
  }

  getWxShare = () => {
    const profile = this.getSegment('profiles', 0);
    const title = this.getPageTitle(profile.name);
    const photo = profile.photo;

    const experience = this.getSegment('experiences', 0);
    const education = this.getSegment('educations', 0);
    const expDesc = experience.title && `经历:${experience.title}`;
    const eduDesc = education.university && education.university.name && `教育:${education.university.name}`;

    const {uid} = this.props;

    return {
      title,
      desc: compact([expDesc, eduDesc]).join('\n'),
      link: `${window.location.origin}/career/${uid}`,
      imgUrl: photo && (photo.large || photo.small) || '',
      success: function () {},
      cancel: function () {}
    };
  };

  getPageTitle(name) {
    return name ? `${name}的档案` : '档案';
  }

  getSegment(section_name, index, defaultValue) {
    return dot(this.props.career, 'career', section_name, 'segments', index) || defaultValue || {};
  }

  renderProfile() {
    // 传入profile, education, experience, objective
    return (<ProfileView
      isPost={this.props.isPost}
      jobId={this.props.jobId}
      profile={this.getSegment('profiles', 0)}
      uid={this.props.uid}
      education={this.getSegment('educations', 0)}
      experience={this.getSegment('experiences', 0)}
      objective={this.getSegment('objective', 0)}
      isEditable={this.props.isEditable}
      loadEditType={this.props.loadEditType}
      loadEditData={this.props.loadEditData}
    />);
  }

  renderComment() {
    const comment = this.props.career.latestEvaluation;
    const comments = this.props.comments;
    if (!comment) {
      return null;
    }
    return (
      <div className="career-view__item">
        <div className="career-view__item-title">朋友评价</div>
        {(() => {
          if (isEmpty(comments)) {
            return (
              <div>
                <CommentView comment={comment}/>
                <div className="career-view__item-segment" onTouchTap={() => {
                  this.props.loadComments(this.props.uid);
                }}>
                  <div className="career-view__item-segment-with-downarrow">
                    <span className="career-view__item-segment-comment-more">更多评价</span>
                  </div>
                </div>
              </div>
            );
          } else {
            return this.props.comments.map((comment) => {
              return <CommentView key={comment.id} comment={comment}/>;
            });
          }
        })()
}
      </div>
    );
  }

  render() {
    const career = this.props.career.career;
    const tags = this.props.career.tags;
    const jobId = this.props.jobId;

    const {drawerMenuInfo, uid} = this.props;

    return (
      <div className="career-view__box">
        {this.renderProfile()}
        {
          this.props.isEditable &&
          <SeekJobStatusView
            jobId={jobId}
            objective={this.getSegment('objective', 0, {seek_job_status: '1'})}
            loadEditType={this.props.loadEditType}
            loadEditData={this.props.loadEditData}
            isEditable={this.props.isEditable}
          />
        }
        <ItemListView
          jobId={jobId}
          career={career}
          isEditable={this.props.isEditable}
          isPost={!!this.props.isPost}
          loadEditType={this.props.loadEditType}
          loadEditData={this.props.loadEditData}
        />
        {!this.props.isEditable && !isEmpty(tags) && <TagView jobId={jobId} tags={tags}/>}
        {!this.props.isEditable && this.renderComment()}
        {
          this.props.isPost &&
          this.props.isEditable &&
          <PostBarView jobId={jobId} career={career} deliverJob={this.props.deliverJob}/>
        }
        {
          (!this.props.isEditable) &&
          drawerMenuInfo && (drawerMenuInfo.id === uid) &&
          <div className="career-view__stickbar">
            <Link className="career-view__stickbar-link" to="/career">编辑档案</Link>
          </div>
        }
      </div>
    );
  }
}

export default CareerView;
