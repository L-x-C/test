import React, {Component, PropTypes} from "react";
import {browserHistory} from 'react-router';
import {getDateTime} from '../../helpers/dateHelper';
import defaultAvatar from "../../images/avatar.png";

class CommentView extends Component {
  static propTypes = {
    comment: PropTypes.object
  }

  render() {
    const comment = this.props.comment;
    // 兼容两个接口。有的没有segments
    const profiles = comment.from.career.profiles;
    const profile = profiles.segments ? profiles.segments[0] : profiles;
    let relation = comment.from.relation || comment.relation;
    const uid = comment.from.uid;
    return (
      <div className="career-view__item-segment" onTouchTap={()=>{
          browserHistory.push(`/career/${uid}`);
        }}>
        <div className="career-view__comment-from">
          <div className="career-view__comment-from-avatar">
            <img src={profile.photo.large || defaultAvatar} alt="avatar"/>
          </div>
          <div className="career-view__comment-from-time">
            {getDateTime(comment.createdAt)}
          </div>
          <div className="career-view__comment-from-name">
            {profile.name}
          </div>
          <div className="career-view__comment-from-relation">
            {relation.name}
          </div>
        </div>
        <div className="career-view__comment-content">
          {comment.content}
        </div>
      </div>
    );
  }
}

export default CommentView;
