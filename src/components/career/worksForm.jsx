import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {setToolBar} from '../../actions/toolBarActions';
import {reduxForm, Field, propTypes, SubmissionError} from 'redux-form';
import {editCareer, delCareerItem, loadEditType, loadMyCareer, prepareSelectorData} from '../../actions';
import {getDate} from '../../helpers/dateHelper';
import Selector from '../../containers/Selector.js';
import initialState from '../../reducers/initialState';

import ArrayTextarea from './formComponents/arrayTextarea.jsx';
const section_name = 'works';

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
      title: '编辑个人作品',
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
              时间
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
              作品名称
            </label>
            <div className="career__item-content">
              <Field name="title" placeholder="请输入作品名称" component="input" type="text"/>
            </div>
          </div>
          <div className="career__item">
            <label>
              副标题
            </label>
            <div className="career__item-content">
              <Field name="subtitle" placeholder="请输入副标题" component="input" type="text"/>
            </div>
          </div>
          <div className="career__item">
            <label>
              <span className="career__form-required">*</span>
              作品描述
            </label>
            <div className="career__item-content">
              <Field name="content" placeholder="请填写，可填写包括文章/图片/词曲/视频/设计/程序等个人作品，需写清浏览链接，或在附页展示(2-1000字符)" seperator={"\n"} component={ArrayTextarea}/>
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
          }} disabled={submitting}>删除此作品</button>}
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
