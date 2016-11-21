import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {setToolBar} from '../../actions/toolBarActions';
import {reduxForm, Field, propTypes, SubmissionError, formValueSelector} from 'redux-form';
import {editCareer, delCareerItem, loadEditType, loadMyCareer, prepareSelectorData} from '../../actions';
import {getDate} from '../../helpers/dateHelper';
import isEmpty from 'lodash/isEmpty';
import Selector from '../../containers/Selector.js';
import initialState from '../../reducers/initialState';

import ArrayTextarea from './formComponents/arrayTextarea.jsx';
const section_name = 'skills';
const selector = formValueSelector(section_name);

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
      title: '编辑技能证书',
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

    const {
      handleSubmit,
      submitting,
      error,
      prepareSelectorData,
      formState,
      initialValues,
      category
    } = this.props;
    const {_id} = initialValues;
    const name = !isEmpty(category)
      ? `${category.text}-${category.sub_category.text}`
      : '';
    const tips = !isEmpty(category) && category.sub_category.tips;
    return (
      <form onSubmit={handleSubmit(this.submit)} autoComplete="off">
        <div className="career__form">
          <div className="career__item">
            <label>
              <span className="career__form-required">*</span>
              证书名称
            </label>
            <div className="career__item-content">
              <input type="text" readOnly value={name} onClick={() => {
                prepareSelectorData(
                  {
                    step: 1,
                    name: 'skillCategory',
                    section_name
                  }
                );
              }} placeholder="请选择证书"/>
            </div>
          </div>
          {!(formState && formState.values && formState.values.category && formState.values.category.value) &&
          <div className="career__item">
            <label>
              补充
            </label>
            <div className="career__item-content">
              <Field name="complement" component="input" placeholder="若上无合适选项请在此填写" type="text"/>
            </div>
          </div>
          }
          <div className="career__item">
            <label>
              成绩
            </label>
            <div className="career__item-content">
              <Field name="level" component="input" placeholder={tips
                ? tips
                : "请填写成绩"} type="text"/>
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
          }} disabled={submitting}>删除此证书</button>}
        </div>
      </form>
    );
  }
}

export default connect(
  state => ({
    selectorState: state.selector,
    formState: state.form[section_name],
    initialValues: state.editCache.data,
    category: selector(state, 'category')
  }),
  {setToolBar, loadEditType, loadMyCareer, prepareSelectorData, delCareerItem}
)(
  reduxForm({form: section_name, destroyOnUnmount: false})(Form)
);
