import React, {Component, PropTypes} from "react";

class TagView extends Component {
  static propTypes = {
    tags: PropTypes.array
  }

  renderTags() {
    const {tags} = this.props;
    const tagList = [];
    tags.forEach((tag)=>{
      const isAgree = tag.agree;
      tagList.push((
        <div key={tag.id} className="career-view__tag">
          <div className={`career-view__tag-name${isAgree? '-agree' : ''}`}>{tag.name}</div>
          <div className={`career-view__tag-agreeCount${isAgree? '-agree' : ''}`}>{tag.agreeCount}</div>
        </div>
      ));
    });
    return (
      <div className="career-view__item-segment-tag">
        <div className="career-view__item-tag-box">{tagList}</div>
      </div>
    );
  }

  render() {
    return (
      <div className="career-view__item">
        <div className="career-view__item-title">技能标签</div>
        {this.renderTags()}
      </div>
    );
  }
}

export default TagView;
