import React, {Component, PropTypes} from 'react';
import {Field} from 'redux-form';
import find from 'lodash/find';
import isArray from 'lodash/isArray';
import trim from 'lodash/trim';
import {textLength} from '../../../helpers';

const renderMember = (props) => (
  <span>{props.value}</span>
);

renderMember.propTypes = {
  value: PropTypes.string
};

class TagInput extends Component {
  static propTypes = {
    fields: PropTypes.object,
    values: PropTypes.array,
    placeholder: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      inputValue: ''
    };
  }

  handleInput = (e) => {
    const value = e.target.value;
    this.setState({inputValue: value});
  }

  showError(error) {
    this.setState({error});
  }

  clearError() {
    this.setState({error: ''});
  }

  addField = (e) => {
    this.clearError();

    const value = trim(e.target.value);
    if ([13, 32].includes(e.keyCode)) {
      const valueLen = textLength(value);
      const {fields, values} = this.props;
      if ((valueLen < 2) || (valueLen > 20)) {
        this.showError('兴趣爱好需为2-20字符');
        return;
      }
      else if (values.length >= 10) {
        this.showError('兴趣爱好不能多于10个');
        return;
      }
      const existTag = find(values, (v) => {
        return v === value;
      });
      if (!existTag) {
        fields.push(value);
      }
      this.setState({inputValue: ''});
    }
  }

  render() {
    const {fields, placeholder} = this.props;
    const {inputValue, error} = this.state;
    return (
      <div>
        {
          error &&
          <div className="career__form-field-error-wrapper">
            <span className="career__form-field-error">{error}</span>
          </div>
        }
        <input type="text" value={inputValue} placeholder={placeholder} onKeyDown={this.addField} onChange={this.handleInput}/>
        <div className="career__form-tags-list">
          {fields.map((member, index) => {
            return (
              <span key={index} className="career__form-tags-list-item">
                <Field name={member} component={renderMember}/>
                <span className="career__form-tags-list-item-delete" onTouchTap={() => {
                  fields.remove(index);
                  this.clearError();
                }}>X</span>
              </span>
            );
          })}
        </div>
      </div>
    );
  }
}

export default TagInput;
