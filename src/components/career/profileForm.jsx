import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {setToolBar} from '../../actions/toolBarActions';
import {reduxForm, Field, propTypes, SubmissionError} from 'redux-form';
import {editCareer, loadEditType, loadMyCareer, prepareSelectorData} from '../../actions';
import {getDate} from '../../helpers/dateHelper';
import Selector from '../../containers/Selector.js';
import initialState from '../../reducers/initialState';

const section_name = 'profiles';

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

  setToolBar() {
    const {selector} = this.props;
    if (selector && selector.name) { return ; }

    const back = this.back.bind(this);
    this.props.setToolBar({
      title: '编辑个人信息',
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
    const {selector, handleSubmit, submitting, error} = this.props;
    if (selector && selector.name) { return <Selector />; }

    const {birthday, address} = this.props.initialValues;
    const birthdayStr = getDate(birthday);
    const addressStr = address && address.name;
    return (
      <form onSubmit={handleSubmit(this.submit)} autoComplete="off">
        <div className="career__form">
          <div className="career__item">
            <label>
              <span className="career__form-required">*</span>姓名</label>
            <div className="career__item-content">
              <Field name="name" component="input" placeholder="请输入名字" type="text"/>
            </div>
          </div>
          <div className="career__item">
            <label>出生年月</label>
            <div className="career__item-content">
              <input type="text" readOnly value={birthdayStr} onClick={() => {
                this.props.prepareSelectorData(
                  {
                    step: 1,
                    name: 'birthday',
                    section_name
                  }
                );
              }} placeholder="例如1990-08"/>
            </div>
          </div>
          <div className="career__item">
            <label>现居住地</label>
            <div className="career__item-content">
              <input type="text" readOnly value={addressStr} onClick={() => {
                this.props.prepareSelectorData(
                  {
                    step: 1,
                    name: 'address',
                    section_name
                  }
                );
              }} placeholder="请选择"/>
            </div>
          </div>
          <div className="career__item">
            <label>性别</label>
            <div className="career__item-content">
              <Field name="gender" component="select">
                <option value="男">男</option>
                <option value="女">女</option>
              </Field>
            </div>
          </div>
          <div className="career__item">
            <label className="career__form-label-with-tips">
              <span className="career__form-required">*</span>
              手机
              <span className="career__form-tips">仅像投递企业显示</span>
            </label>
            <div className="career__item-content">
              <Field name="phone" component="input" placeholder="请输入号码" type="number"/>
            </div>
          </div>
          <div className="career__item">
            <label className="career__form-label-with-tips">
              <span className="career__form-required">*</span>
              邮箱
              <span className="career__form-tips">仅像投递企业显示</span>
            </label>
            <div className="career__item-content">
              <Field name="email" component="input" placeholder="请输入邮箱" type="email"/>
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
        </div>
      </form>
    );
  }
}

export default connect(
  state => ({
    initialValues: state.editCache.data,
    selector: state.selector
  }),
  {
    setToolBar,
    loadEditType,
    loadMyCareer,
    prepareSelectorData
  }
)(
  reduxForm({form: section_name, destroyOnUnmount: false})(Form)
);
