import React, {Component, PropTypes} from 'react';
import isArray from 'lodash/isArray';
import split from 'lodash/split';

class ArrayTextarea extends Component {
  static propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    seperator: PropTypes.string
  }
  constructor(props) {
    super(props);
    this.state = {
      val: ''
    };
  }

  componentDidMount() {
    const {value} = this.props;
    this.setState({
      val: value
        ? value.join(this.props.seperator)
        : ''
    });
  }

  render() {
    let {value, onChange, placeholder, seperator} = this.props;
    // onChange will first look up for obj.value
    return (<textarea placeholder={placeholder} value={this.state.val} onChange={(e) => {
      const v = e.target.value;
      this.setState({val: v});
      let seperator = this.props.seperator;
      if (seperator === ',') {
        seperator = /,|,/;
      }
      onChange(split(v, seperator));
    }} type="text"/>);
  }
}

export default ArrayTextarea;
