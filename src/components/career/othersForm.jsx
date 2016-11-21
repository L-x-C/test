import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {setToolBar} from '../../actions/toolBarActions';
import {reduxForm, Field, propTypes, SubmissionError} from 'redux-form';
import {editCareer, loadEditType, loadMyCareer} from '../../actions';
import {getDate} from '../../helpers/dateHelper';
import initialState from '../../reducers/initialState';

import ArrayTextarea from './formComponents/arrayTextarea.jsx';
const section_name = 'others';

class Form extends Component {
  static propTypes = {
    ...propTypes,
    editData: PropTypes.object,
    setToolBar: PropTypes.func
  }

  componentDidMount() {
    const back = this.back.bind(this);
    this.props.setToolBar({
      title: '编辑其他',
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
    const {handleSubmit, submitting, error, initialValues} = this.props;
    const {start_date, _id} = initialValues;
    const startDateStr = start_date
      ? getDate(initialValues.start_date)
      : '';
    return (
      <form onSubmit={handleSubmit(this.submit)} autoComplete="off">
        <div className="career__form">
          <div className="career__others">
            <Field name="content" placeholder="请填写" seperator={"\n"} component={ArrayTextarea}/>
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
    initialValues: state.editCache.data
  }),
  {setToolBar, loadEditType, loadMyCareer}
)(
  reduxForm({form: section_name, destroyOnUnmount: false})(Form)
);
