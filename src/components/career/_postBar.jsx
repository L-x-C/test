import React, {Component, PropTypes} from 'react';
import addNew from '../../images/addNew.png';
import isEmpty from 'lodash/isEmpty';
import trim from 'lodash/trim';
import {dot} from '../../helpers';

class PostBarView extends Component {
  static propTypes = {
    jobId: PropTypes.string,
    career: PropTypes.object,
    deliverJob: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      onboard: "1"
    };
  }

  render() {
    const {jobId} = this.props;

    const getSegments = (section) => dot(this.props.career, section, 'segments');
    const {phone, email} = dot(getSegments('profiles'), 0) || {};
    const valid =
      trim(phone) &&
      trim(email) &&
      !isEmpty(getSegments('educations',)) &&
      !isEmpty(getSegments('experiences',));

    return (
      <div className="career-view__postbar">
        <div className="career-view__postbar-time">
          <select name="onboard" value={this.state.onboard} onChange={(e) => {
            this.setState({onboard: e.target.value});
          }}>
            <option value="1">随时</option>
            <option value="2">一周内</option>
            <option value="3">两周内</option>
            <option value="4">三周内</option>
            <option value="5">一月内</option>
            <option value="6">一月以上</option>
          </select>
        </div>
        <div className={`career-view__postbar-submit${valid ? '' : ' disabled'}`} onClick={() => {
          if (valid) {
            this.props.deliverJob(jobId, '', this.state.onboard);
          }
        }}>确认投递</div>
      </div>
    );
  }
}

export default PostBarView;
