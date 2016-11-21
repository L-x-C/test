import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {setToolBar} from '../../actions/toolBarActions';
import {reduxForm, FieldArray, propTypes, SubmissionError, formValueSelector} from 'redux-form';
import {editCareer, delCareerItem, loadEditType, loadMyCareer} from '../../actions';
import initialState from '../../reducers/initialState';

import TagInput from './formComponents/tagInput.jsx';

const section_name = 'hobbies';
const selector = formValueSelector(section_name);

class Form extends Component {
  static propTypes = {
    ...propTypes,
    editData: PropTypes.object,
    setToolBar: PropTypes.func
  }

  componentDidMount() {
    const back = this.back.bind(this);
    this.props.setToolBar({
      title: '编辑兴趣爱好',
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

  disableSubmit = (e) => {
    e.preventDefault();
  }

  render() {
    const {handleSubmit, submitting, error, initialValues, content} = this.props;
    return (
      <div>
        <div className="career__form-tags-tips">
          填写可以表达你性格的兴趣，空格换行可添加1-10个
        </div>
        <form onSubmit={this.disableSubmit}>
          <div className="career__form">
            <div className="career__item-tags">
              <FieldArray component={TagInput} name="content" values={content} placeholder="2-20个字符"/>
            </div>
          </div>
          <div className="career__form-submit">
            <p className="career__form-submit-app">
              更多编辑功能前往
              <a href="http://cv.qiaobutang.com/help/getApp" className="career__form-submit-app-link">乔布简历APP</a>
              或网站
            </p>
            {error && <p className="career__form-submit-error">{error}</p>}
            <button type="button" onClick={handleSubmit(this.submit)} disabled={submitting}>保存</button>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(
  state => ({
    initialValues: state.editCache.data,
    content: selector(state, 'content')
  }),
  {setToolBar, delCareerItem, loadEditType, loadMyCareer}
)(
  reduxForm({form: section_name, destroyOnUnmount: false})(Form)
);
