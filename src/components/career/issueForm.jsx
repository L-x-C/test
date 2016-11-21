import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {setToolBar} from '../../actions/toolBarActions';
import {reduxForm, Field, FieldArray, propTypes, SubmissionError} from 'redux-form';
import {editCareer, delCareerItem, loadEditType, loadMyCareer, prepareSelectorData} from '../../actions';
import isEmpty from 'lodash/isEmpty';
import assign from 'lodash/assign';
import trim from 'lodash/trim';
import {textLength} from '../../helpers';
import Selector from '../../containers/Selector.js';
import initialState from '../../reducers/initialState';

import ArrayTextarea from './formComponents/arrayTextarea.jsx';
const section_name = 'issues';

const renderMembers = ({fields, values}) => (
  <div>
    {fields.map((member, index) => {
      const v = values[index];
      return (
        <div key={index} className="career__item">
          <label>
            {v.required && <span className="career__form-required">*</span>}
            {v.text}
          </label>
          <div className="career__item-content">
            <Field name={`${member}.value`} component={v.multi_line ? 'textarea' : 'input'} placeholder={v.tips} type="text"/>
          </div>
        </div>
      );
    })}
  </div>
);

renderMembers.propTypes = {
  fields: PropTypes.object,
  values: PropTypes.array
};

// </div>
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
      title: '编辑专利论文',
      back
    });
  }

  back() {
    this.props.loadEditType(initialState.editType);
  }

  submit = (_values, dispatch) => {
    const values = assign({}, _values, {fields: _values.fields.map(field => assign({value: ''}, field))});

    return new Promise((ros, rej) => {
      const errors = [];
      values.fields.forEach(field => {
        const {value, text, required, min_len, max_len} = field;
        const valueLen = textLength(trim(value));
        if (valueLen > 0) {
          if (valueLen < (min_len || 0)) {
            errors.push(`${text}不能少于${min_len}个字符`);
          }
          const maxLen = max_len || 0;
          if ((maxLen > 0) && (valueLen > maxLen)) {
            errors.push(`${text}不能多于${maxLen}个字符`);
          }
        }
        else {
          if (required) {
            errors.push(`请填写${text}`);
          }
        }
      });
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

    const {handleSubmit, submitting, error, prepareSelectorData, initialValues} = this.props;
    const {category, fields, _id} = initialValues;
    const name = !isEmpty(category)
      ? `${category.text}-${category.sub_category.text}`
      : '';
    return (
      <form onSubmit={handleSubmit(this.submit)} autoComplete="off">
        <div className="career__form">
          <div className="career__item">
            <label>
              <span className="career__form-required">*</span>
              类型
            </label>
            <div className="career__item-content">
              <input type="text" readOnly value={name} onClick={() => {
                prepareSelectorData(
                  {
                    step: 1,
                    name: 'issuesCategory',
                    section_name
                  }
                );
              }} placeholder="请选择"/>
            </div>
          </div>
          {name && <FieldArray name="fields" values={fields} component={renderMembers}/>}
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
          }} disabled={submitting}>删除此专利论文</button>}
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
