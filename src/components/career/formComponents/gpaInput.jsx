import React, {Component, PropTypes} from 'react';

class Input extends Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func
  }
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      max: ''
    };
  }

  componentDidMount() {
    const {value} = this.props;
    this.setState({value: value.value, max: value.max});
  }

  isValid(v) {
    return (v.length <= 4) && /^\d*\.?\d*$/.test(v);
  }

  render() {
    let {onChange} = this.props;
    // onChange will first look up for obj.value
    return (
      <div>
        <input className="career__item-content-taginput" placeholder="3.0" value={this.state.value || ''} onChange={(e) => {
          const v = e.target.value;
          if (!this.isValid(v)) {
            return;
          }
          this.setState({value: v});
          onChange({
            value: {
              value: +v,
              max: this.props.value.max
            }
          });
        }} type="text"/>
        <span>
          /
        </span>
        <input className="career__item-content-taginput" placeholder="4.0" value={this.state.max || ''} onChange={(e) => {
          const v = e.target.value;
          if (!this.isValid(v)) {
            return;
          }
          this.setState({max: v});
          onChange({
            value: {
              value: this.props.value.value,
              max: +v
            }
          });
        }} type="text"/>
      </div>
    );
  }
}

export default Input;
