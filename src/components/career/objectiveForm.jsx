import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {setToolBar} from '../../actions/toolBarActions';
import {loadEditType, loadMyCareer, prepareSelectorData} from '../../actions';
import {
  reduxForm,
  Field,
  FieldArray,
  propTypes,
  SubmissionError,
  formValueSelector
} from 'redux-form';
import {editCareer} from '../../actions';
import isEmpty from 'lodash/isEmpty';
import Selector from '../../containers/Selector.js';
import initialState from '../../reducers/initialState';

const section_name = 'objective';
const selector = formValueSelector(section_name);

const renderMembers = ({fields, values}) => (
  <div className="career__item-content-checkbox">
    {['全职', '实习'].map((item) => {
      let className = 'career__item-content-checkbox-item';
      const inArr = values && values.includes(item);
      if (inArr) {
        className += '-active';
      }
      return (
        <span key={item} className={className} value={item} onClick={(e) => {
          const value = e.target.value;
          if (!inArr) {
            fields.push(value);
          } else {
            const index = values.indexOf(value);
            fields.remove(index);
          }
        }}>{item}</span>
      );
    })}
  </div>
);

renderMembers.propTypes = {
  fields: PropTypes.object,
  values: PropTypes.array
};

const validate = values => {
  const errors = {};
  const jobKind = values.job_kind;
  if (!(jobKind && jobKind.length)) {
    errors._error = '职位性质为必填项';
  }
  return errors;
};

class Form extends Component {
  static propTypes = {
    ...propTypes,
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
      title: '编辑求职意向',
      back
    });
  }

  back() {
    this.props.loadEditType(initialState.editType);
  }

  submit = (values, dispatch) => {
    return new Promise((ros, rej) => {
      const error = validate(values);
      if (!isEmpty(error)) {
        return rej(new SubmissionError(error));
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

    const {
      handleSubmit,
      submitting,
      error,
      prepareSelectorData,
      seek_job_status,
      initialValues,
      job_kind
    } = this.props;
    const {intention_name, city} = initialValues;
    const addressStr = city && city.name;
    return (
      <form onSubmit={handleSubmit(this.submit)} autoComplete="off">
        <div className="career__form">
          <div className="career__item">
            <label>
              <span className="career__form-required">*</span>
              求职状态
            </label>
            <div className="career__item-content">
              <Field name="seek_job_status" component="select">
                <option value="0">找工作中</option>
                <option value="1">暂时没有</option>
              </Field>
            </div>
          </div>
          {seek_job_status === '0' && <div>
            <div className="career__item">
              <label>
                <span className="career__form-required">*</span>期望地点</label>
              <div className="career__item-content">
                <input type="text" readOnly value={addressStr} onClick={() => {
                  prepareSelectorData(
                    {
                      step: 1,
                      name: 'city',
                      section_name
                    }
                  );
                }} placeholder="请选择"/>
              </div>
            </div>
            <div className="career__item">
              <label>
                <span className="career__form-required">*</span>
                职位类型</label>
              <div className="career__item-content">
                <input type="text" readOnly value={intention_name || '不限'} onClick={() => {
                  prepareSelectorData(
                    {
                      step: 1,
                      name: 'intention',
                      section_name
                    }
                  );
                }} placeholder="请选择"/>
              </div>
            </div>
            <div className="career__item">
              <label>
                <span className="career__form-required">*</span>
                期望职位
              </label>
              <div className="career__item-content">
                <Field name="job_title" component="input" placeholder="请输入" type="text"/>
              </div>
            </div>
            <div className="career__item">
              <label>
                <span className="career__form-required">*</span>
                职位性质
              </label>
              <div className="career__item-content">
                <FieldArray name="job_kind" values={job_kind} component={renderMembers}/>
              </div>
            </div>
          </div>}
        </div>
        <div className="career__form-submit">
          <p className="career__form-submit-app">
            更多编辑功能前往
            <a href="http://cv.qiaobutang.com/help/getApp" className="career__form-submit-app-link">乔布简历APP</a>
            或网站
          </p>
          {error && <p className="career__form-submit-error">{error}</p>}
          <button type="submit" disabled={submitting}>保存</button>
        </div>
      </form>
    );
  }
}

export default connect(
  state => ({
    selectorState: state.selector,
    initialValues: state.editCache.data,
    seek_job_status: selector(state, 'seek_job_status'),
    job_kind: selector(state, 'job_kind')
  }),
  {setToolBar, loadEditType, loadMyCareer, prepareSelectorData}
)(
  reduxForm({form: section_name, destroyOnUnmount: false})(Form)
);
