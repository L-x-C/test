import React, {Component, PropTypes} from "react";
import defaultAvatar from "../../images/avatar.png";
import editWhite from "../../images/edit-white.png";
import isEmpty from 'lodash/isEmpty';
import trim from 'lodash/trim';

class ProfileView extends Component {
  static propTypes = {
    jobId: PropTypes.string,
    uid: PropTypes.string,
    profile: PropTypes.object,
    education: PropTypes.object,
    experience: PropTypes.object,
    objective: PropTypes.object,
    loadEditType: PropTypes.func,
    loadEditData: PropTypes.func,
    isEditable: PropTypes.bool,
    isPost: PropTypes.string
  }

  renderInfo() {
    const name = this.props.profile.name;
    const {education, experience, objective} = this.props;
    let doms = [];
    if (name) {
      doms.push((
        <div key="name" className="career-view__info-item-name">
          {name}
        </div>
      ));
    }
    // if (!isEmpty(objective) && objective.seek_job_status !== '1') {
    //   doms.push((
    //     <div key="objective" className="career-view__info-item">
    //       {`求职意向：${objective.job_title}|${objective.intention_name}|${objective.city.name}`}
    //     </div>
    //   ));
    // }
    if (!isEmpty(experience)) {
      doms.push((
        <div key="experience" className="career-view__info-item">
          {`经历：${experience.title || ""}`}
        </div>
      ));
    }
    if (!isEmpty(education)) {
      doms.push((
        <div key="education" className="career-view__info-item">
          {`教育：${education.university.name || ""}`}
        </div>
      ));
    }
    return (
      <div className="career-view__info">
        {doms}
      </div>
    );
  }

  renderAvatar() {
    const {photo} = this.props.profile;
    const photoSrc = photo && (photo.large || photo.small) || defaultAvatar;
    return (
      <div className="career-view__avatar">
        <img src={photoSrc} alt="avatar"/>
      </div>
    );
  }

  renderRequired() {
    const {phone, email} = this.props.profile;
    const required = [];
    if (!trim(phone)) { required.push('手机'); }
    if (!trim(email)) { required.push('邮箱'); }
    return (!isEmpty(required)) && <div className="career-view__info-item-required">{`请完善${required.join('和')}`}</div>;
  }

  render() {
    return (
      <div className="career-view__profile">
        {this.renderAvatar()}
        {this.props.isEditable && <div className="career-view__profile-edit-icon" onTouchTap={() => {
          this.props.loadEditData({type: 'profiles', data: this.props.profile});
          this.props.loadEditType('profiles');
        }}><img src={editWhite}/></div>}
        {this.renderInfo()}
        {this.props.isPost && this.renderRequired()}
      </div>
    );
  }
}

export default ProfileView;
