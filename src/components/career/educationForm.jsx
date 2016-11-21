import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {setToolBar} from '../../actions/toolBarActions';
import {reduxForm, Field, propTypes, SubmissionError} from 'redux-form';
import {editCareer, delCareerItem, loadEditType, loadMyCareer, prepareSelectorData} from '../../actions';
import {getDate} from '../../helpers/dateHelper';
import Selector from '../../containers/Selector.js';
import initialState from '../../reducers/initialState';
import {dot} from '../../helpers';
import isEmpty from 'lodash/isEmpty';
import compact from 'lodash/compact';

import ArrayTextarea from './formComponents/arrayTextarea.jsx';

import GPAInput from './formComponents/gpaInput.jsx';
const section_name = 'educations';

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
      title: '编辑教育背景',
      back
    });
  }

  back() {
    this.props.loadEditType(initialState.editType);
  }

  submit = (values, dispatch) => {
    return new Promise((ros, rej) => {
      const errors = [];
      if (isEmpty(values.university)) {
        errors.push('请选择学校');
      }
      if (!values.start_date) {
        errors.push('请选择入学时间');
      }
      if (!values.end_date) {
        errors.push('请选择毕业时间');
      }
      const majorLength = (values.major || '').length;
      if (majorLength < 2 || majorLength > 100) {
        errors.push('专业须为2-100字符');
      }
      if (!values.degree) {
        errors.push('请选择学历');
      }
      if (!isEmpty(errors)) {
        return rej(new SubmissionError({_error: errors.join('; ')}));
      }

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

    const {handleSubmit, submitting, error, prepareSelectorData, formState, educationCount, initialValues} = this.props;
    const {university, college, start_date, end_date, _id} = initialValues;
    const universityStr = compact([dot(university, 'name'), dot(college, 'name')]).join('-');
    const startDateStr = start_date
      ? getDate(initialValues.start_date)
      : '';
    const endDateStr = end_date
      ? getDate(initialValues.end_date)
      : '';
    return (
      <form onSubmit={handleSubmit(this.submit)} autoComplete="off">
        <div className="career__form">
          <div className="career__item">
            <label>
              <span className="career__form-required">*</span>
              学校学院
            </label>
            <div className="career__item-content">
              <input type="text" readOnly value={universityStr} onClick={() => {
                prepareSelectorData(
                  {
                    step: 1,
                    name: 'university_domestic',
                    section_name
                  }
                );
              }} placeholder="请选择学校学院"/>
            </div>
          </div>
          <div className="career__item">
            <label>
              <span className="career__form-required">*</span>
              入学时间
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
              毕业时间</label>
            <div className="career__item-content">
              <input type="text" readOnly value={endDateStr} onClick={() => {
                prepareSelectorData(
                  {
                    step: 1,
                    name: 'end_date',
                    section_name
                  }
                );
              }} placeholder="例如2013-06"/>
            </div>
          </div>
          <div className="career__item">
            <label>
              <span className="career__form-required">*</span>
              专业
            </label>
            <div className="career__item-content">
              <Field name="major" component="input" placeholder="请输入" type="text"/>
            </div>
          </div>
          <div className="career__item">
            <label>
              <span className="career__form-required">*</span>
              学历
            </label>
            <div className="career__item-content">
              <Field name="degree" component="select" style={{
                color: (formState && formState.values && formState.values.degree) ? '' : '#C7C7C7'
              }}>
                <option value="">请选择</option>
                <option value="中技">中技</option>
                <option value="中专">中专</option>
                <option value="大专">大专</option>
                <option value="本科">本科</option>
                <option value="研究生">研究生</option>
                <option value="博士">博士</option>
                <option value="MBA">MBA</option>
                <option value="其他">其他</option>
              </Field>
            </div>
          </div>
          <div className="career__item">
            <label>
              导师
            </label>
            <div className="career__item-content">
              <Field name="tutor" component="input" placeholder="请输入" type="text"/>
            </div>
          </div>
          <div className="career__item">
            <label>
              GPA
            </label>
            <div className="career__item-content">
              <Field name="average_point" component={GPAInput}/>
            </div>
          </div>
          <div className="career__item">
            <label>
              课程
            </label>
            <div className="career__item-content">
              <Field name="course" placeholder="请填写对应聘岗位有帮助的课程，如跨专业求职，而自己辅修过对口专业的课程(2-1000字符)" seperator="," component={ArrayTextarea}/>
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
          {
            (educationCount > 1) && _id &&
            <button
              type="button"
              className="career-button"
              disabled={submitting}
              onClick={() => {
                this.props.delCareerItem({
                  section_name,
                  data: {
                    _id
                  }
                });
              }}
            >删除此经历</button>
          }
        </div>
      </form>
    );
  }
}

export default connect(
  state => ({
    selectorState: state.selector,
    formState: state.form[section_name],
    educationCount: dot(state.career, 'career', 'educations', 'segments', 'length') || 0,
    initialValues: state.editCache.data
  }),
  {setToolBar, loadEditType, loadMyCareer, prepareSelectorData, delCareerItem}
)(
  reduxForm({form: section_name, destroyOnUnmount: false})(Form)
);
