import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {setToolBar} from '../../actions/toolBarActions';
import {reduxForm, Field, propTypes, SubmissionError} from 'redux-form';
import {editCareer, delCareerItem, loadEditType, loadMyCareer, prepareSelectorData} from '../../actions';
import {getDate} from '../../helpers/dateHelper';
import Selector from '../../containers/Selector.js';
import initialState from '../../reducers/initialState';

import ArrayTextarea from './formComponents/arrayTextarea.jsx';
const section_name = 'honors';

class Form extends Component {
  static propTypes = {
    ...propTypes,
    editData: PropTypes.object,
    setToolBar: PropTypes.func
  }

  componentDidMount() {
    this.setToolBar();
  }

  componentDidUpdate() {
    this.setToolBar();
  }

  hasSelectorState() {
    const {selectorState} = this.props;
    return !!(selectorState && selectorState.name);
  }

  setToolBar() {
    if (this.hasSelectorState()) { return; }

    const back = this.back.bind(this);
    this.props.setToolBar({
      title: '编辑荣誉奖励',
      back
    });
  }

  back() {
    this.props.loadEditType(initialState.editType);
  }

  submit = (values, dispatch) => {
    return new Promise((ros, rej) => {
      return new Promise((resolve, reject) => {
        dispatch(editCareer({
          values: JSON.stringify({section_name, data: values}),
          resolve,
          reject
        }));
      }).then((response) => {
        ros(response);
        this.props.loadMyCareer();
        this.back();
      }).catch(_error => {
        rej(new SubmissionError({_error}));
      });
    });
  }

  render() {
    if (this.hasSelectorState()) { return <Selector />; }

    const {handleSubmit, submitting, error, prepareSelectorData, initialValues} = this.props;
    const {start_date, _id} = initialValues;
    const startDateStr = start_date
      ? getDate(initialValues.start_date)
      : '';
    return (
      <form onSubmit={handleSubmit(this.submit)} autoComplete="off">
        <div className="career__form">
          <div className="career__item">
            <label>
              <span className="career__form-required">*</span>
              获得时间
            </label>
            <div className="career__item-content">
              <input type="text" readOnly value={startDateStr} onClick={() => {
                prepareSelectorData(
                  {
                    step: 1,
                    name: 'start_date',
                    section_name
                  }
                );
              }} placeholder="例如2009-09"/>
            </div>
          </div>
          <div className="career__item">
            <label>
              <span className="career__form-required">*</span>
              荣誉内容
            </label>
            <div className="career__item-content">
              <Field name="content" placeholder="如专业比赛奖项、商业大赛名称、社会活动奖励、文体活动奖励、院校级学生奖项等(2-1000字符)" seperator={"\n"} component={ArrayTextarea}/>
            </div>
          </div>
        </div>
        <div className="career__form-submit">
          <p className="career__form-submit-app">
            更多编辑功能前往
            <a href="http://cv.qiaobutang.com/help/getApp" className="career__form-submit-app-link">乔布简历APP</a>
            或网站
          </p>
          {error && <p className="career__form-submit-error">{error}</p>}
          <button type="submit" disabled={submitting}>保存</button>
          {_id && <button type="button" className="career-button" onClick={() => {
            this.props.delCareerItem({section_name, data: {
                _id
              }});
          }} disabled={submitting}>删除此荣誉奖励</button>}
        </div>
      </form>
    );
  }
}

export default connect(
  state => ({
    selectorState: state.selector,
    initialValues: state.editCache.data
  }),
  {setToolBar, loadEditType, loadMyCareer, prepareSelectorData, delCareerItem}
)(
  reduxForm({form: section_name, destroyOnUnmount: false})(Form)
);
