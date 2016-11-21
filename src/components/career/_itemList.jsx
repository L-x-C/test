import React, {Component, PropTypes} from 'react';
import ItemView from './_item.jsx';
import {getDate} from '../../helpers/dateHelper';
import {dot} from '../../helpers';
import isEmpty from 'lodash/isEmpty';
import compact from 'lodash/compact';

const TITLES = {
  'educations': '教育背景',
  'experiences': '个人经历',
  'skills': '技能证书',
  'honors': '荣誉奖励',
  'works': '个人作品',
  'issues': '专利论文',
  'hobbies': '兴趣爱好',
  'others': '其他信息'
};

const SUBTITLES = {
  // 'experiences': '（工作、实习、实践、项目等）'
};

function markSectionRequired(section, career) {
  return ['educations', 'experiences'].includes(section) && isEmpty(dot(career, section, 'segments'));
}

function compactAndJoin(array) {
  return compact(array).join(' ');
}

function findFirstValueByKeys(array, ...keys) {
  for (let i = 0; i < array.length; i++) {
    const {key, value} = array[i];
    if (keys.includes(key)) {
      return value;
    }
  }
}

// 从segments里提取信息
function getInfo(title, segment) {
  let rst;
  switch (title) {
    case 'educations':
      rst = compactAndJoin([dot(segment, 'university', 'name'), dot(segment, 'college', 'name'), segment.major, segment.degree]);
      break;
    case 'experiences':
      rst = compactAndJoin([segment.title, segment.subtitle]);
      break;
    case 'skills':
      rst = !isEmpty(segment.category)
        ? compactAndJoin([segment.category.text, segment.category.sub_category.text, segment.level])
        : compactAndJoin([segment.complement, segment.level]);
      break;
    case 'honors':
      rst = compactAndJoin([segment.content[0]]);
      break;
    case 'works':
      rst = compactAndJoin([segment.title]);
      break;
    case 'issues':
      rst = !isEmpty(segment.category)
        ? compactAndJoin([segment.category.text, findFirstValueByKeys(segment.fields, 'name', 'title')])
        : compactAndJoin([...segment.content]);
      break;
    case 'hobbies':
      rst = segment.content.join(' ');
      break;
    case 'others':
      rst = compactAndJoin([segment.content[0]]);
      break;
  }
  return rst;
}

function getPeriods(startAt, endAt) {
  let start = getDate(startAt);
  const getEnd = () => {
    const endDate = getDate(endAt);
    return endDate && `至 ${endDate}`;
  };
  const end = (endAt === '') ? '至今' : getEnd();
  return end
    ? `${start} ${end}`
    : start;
}

class ItemListView extends Component {
  static propTypes = {
    jobId: PropTypes.string,
    career: PropTypes.object,
    experiences: PropTypes.object,
    skills: PropTypes.object,
    honors: PropTypes.object,
    isPost: PropTypes.bool,
    isEditable: PropTypes.bool,
    loadEditType: PropTypes.func,
    loadEditData: PropTypes.func
  }

  renderList() {
    const career = this.props.career;
    if (isEmpty(career)) {
      return null;
    }
    let doms = [];
    for (let item of Object.keys(TITLES)) {
      const content = career[item];
      if ((content && !isEmpty(content.segments)) || this.props.isEditable) {
        const title = TITLES[item];
        const subtitle = SUBTITLES[item];
        let _segments = [];
        for (let segment of content.segments) {
          let periods = getPeriods(segment.start_date, segment.end_date);
          let info = getInfo(item, segment);
          if (info) {
            _segments.push({periods, info, type: item, segment});
          }
        }
        doms.push(
          (<ItemView
            jobId={this.props.jobId}
            key={content._id}
            title={title}
            subtitle={subtitle}
            required={this.props.isPost && markSectionRequired(item, career)}
            segments={_segments}
            type={item}
            isEditable={this.props.isEditable}
            loadEditType={this.props.loadEditType}
            loadEditData={this.props.loadEditData}
          />)
        );
      }
    }
    return (
      <div>
        {doms}
      </div>
    );
  }

  render() {
    return this.renderList();
  }
}

export default ItemListView;
