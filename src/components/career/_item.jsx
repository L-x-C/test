import React, {Component, PropTypes} from 'react';
import addNew from '../../images/addNew.png';
import editBlack from '../../images/edit-black.png';
import {getInitialData} from '../../helpers/formInitialize';

function checkCanAddNew(type, length) {
  if (['hobbies', 'others'].includes(type) && length > 0) {
    return false;
  }
  return true;
}

class ItemView extends Component {
  static propTypes = {
    jobId: PropTypes.string,
    type: PropTypes.string,
    title: PropTypes.string,
    segments: PropTypes.array,
    subtitle: PropTypes.string,
    loadEditType: PropTypes.func,
    loadEditData: PropTypes.func,
    required: PropTypes.bool,
    isEditable: PropTypes.bool
  }

  render() {
    const {title, segments, subtitle, isEditable, type} = this.props;
    let withArrowClassName;
    if (isEditable) {
      withArrowClassName = 'career-view__item-segment-with-arrow';
    }
    let rows = [];
    for (let item of segments) {
      rows.push((
        <div key={item.segment._id} className="career-view__item-segment">
          <div className={withArrowClassName} onClick={(event) => {
            event.stopPropagation();
            if (withArrowClassName) {
              this.props.loadEditData({type, data: item.segment});
              this.props.loadEditType(type);
            }
          }}>
            {item.periods && <div className="career-view__item-segment-periods">{item.periods}</div>}
            <div className="career-view__item-segment-info">{item.info}</div>
          </div>
        </div>
      ));
    }
    return (
      <div className="career-view__item">
        <div className="career-view__item-title">{title}</div>
        <div className="career-view__item-subtitle">{subtitle}</div>
        {this.props.required && <div className="career-view__item-required">（必填）</div>}
        {this.props.isEditable && checkCanAddNew(type, segments.length) && (
          <div className="career-view__item-addNew" onClick={() => {
            this.props.loadEditData({
              type,
              data: getInitialData(this.props.type)
            });
            this.props.loadEditType(type);
          }}>
            <img src={addNew}/>
          </div>
        )}
        {rows}
      </div>
    );
  }
}

export default ItemView;
