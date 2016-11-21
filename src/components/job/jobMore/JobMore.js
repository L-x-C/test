import React, { Component, PropTypes } from 'react';
import './jobMore.scss';

export default class JobMore extends Component {
  state = {
    expand: false
  };

  triggerExpand = () => {
    this.setState({
      expand: !this.state.expand
    });
  };

  getContentClass = () => {
    if (this.state.expand) {
      return 'job-more__content nomax';
    } else {
      return 'job-more__content';
    }
  };

  render() {
    return (
      <div className="job-more">
        <pre className="job-more__content nomax">{this.props.data}</pre>
        {/*!this.state.expand &&
        <div className="job-more__trigger" onClick={this.triggerExpand}>
          展开全部<i className="icon-angle-down"></i>
        </div> */}
      </div>
    );
  }
}


JobMore.propTypes = {
  data: PropTypes.string.isRequired
};
